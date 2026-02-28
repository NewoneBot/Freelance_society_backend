import bcrypt from "bcrypt";
import Users from "../../../../db/models/Users.js";
import { generateToken } from "../../../../util/helper.js";
import { Op, fn, col } from "sequelize";
import { UserInputError } from "apollo-server";

const now = new Date();

// Start of today (00:00:00)
const todayStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
).getTime();

// End of today (23:59:59.999)
const todayEnd = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  23,
  59,
  59,
  999,
).getTime();

const resolvers = {
  Query: {
    getMembers: async (_, { limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            role: {
              [Op.in]: [1, 2, 3],
            },
          },
          order: [["id", "DESC"]],
          limit,
          offset,
        });

        const totalCount = await Users.count({
          where: {
            role: {
              [Op.in]: [1, 2, 3],
            },
          },
        });

        return {
          users,
          totalCount,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users.");
      }
    },
    getClient: async (_, { limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            role: 4, // Only clients
          },
          order: [["id", "DESC"]],
          limit,
          offset,
        });

        const totalCount = await Users.count({
          where: {
            role: 4,
          },
        });

        return {
          users,
          totalCount,
        };
      } catch (error) {
        console.error("Error fetching client users:", error);
        throw new Error("Failed to fetch clients.");
      }
    },
    getProfileList: async (_, { limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            role: {
              [Op.in]: [1, 2, 3, 5], // ✅ Include roles 1, 2, 3, and 5
            },
          },
          order: [["id", "DESC"]],
          limit,
          offset,
        });

        const totalCount = await Users.count({
          where: {
            role: {
              [Op.in]: [1, 2, 3, 5], // ✅ Same filter for count
            },
          },
        });

        return {
          users,
          totalCount,
        };
      } catch (error) {
        console.error("Error fetching profile users:", error);
        throw new Error("Failed to fetch profiles.");
      }
    },
    getUserById: async (_parent, { id }) => {
      try {
        const user = await Users.findOne({ where: { id } });

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw new Error("Failed to fetch user by ID.");
      }
    },
    getClientStatusCounts: async () => {
      try {
        const totalUsers = await Users.count();

        const rawCounts = await Users.findAll({
          attributes: [
            "client_upstatus",
            [fn("COUNT", col("client_upstatus")), "count"],
          ],
          where: {
            client_upstatus: {
              [Op.in]: [1, 2, 4, 5, 6],
            },
          },
          group: ["client_upstatus"],
          raw: true,
        });

        // ✅ Native JS to get today's start and end
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        ).getTime();
        const todayEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        ).getTime();

        const todayInterestedCount = await Users.count({
          where: {
            client_upstatus: 2,
            created_at: {
              [Op.between]: [todayStart, todayEnd],
            },
          },
        });

        const todayLongFollowUpCount = await Users.count({
          where: {
            client_upstatus: 4,
            created_at: {
              [Op.between]: [todayStart, todayEnd],
            },
          },
        });

        const statusMap = {
          1: "followUp",
          2: "interested",
          4: "longFollowUp",
          5: "deleted",
          6: "closed",
        };

        const counts = {
          totalUsers,
          followUp: 0,
          interested: 0,
          longFollowUp: 0,
          deleted: 0,
          closed: 0,
          todayInterested: todayInterestedCount,
          todayLongFollowUp: todayLongFollowUpCount,
        };

        rawCounts.forEach(({ client_upstatus, count }) => {
          const key = statusMap[client_upstatus];
          if (key) {
            counts[key] = parseInt(count, 10);
          }
        });

        return counts;
      } catch (error) {
        console.error("Error fetching client status counts:", error);
        throw new Error("Failed to fetch status counts.");
      }
    },
  },
  Mutation: {
    createUser: async (_, { userInput }, { user }) => {
      try {
        const {
          firstname,
          lastname,
          email,
          role,
          password,
          company_name,
          country_code,
          number,
          alt_country_code,
          alt_number,
          country,
          state,
          city,
          zipcode,
          address1,
          address2,
          ult_parent_id,
          status,
          client_upstatus,
          dob,
          no_of_calls,
          callback,
          gender,
          parent_id,
          // New fields
          title,
          description,
          experience,
          T_Projects,
          S_Client_satisfaction,
        } = userInput;

        const errors = {};

        // Field validations
        if (!firstname || firstname.trim() === "") {
          errors.firstname = "First name is required.";
        }
        if (!email || email.trim() === "") {
          errors.email = "Email is required.";
        }

        if (!number || number.toString().length < 7) {
          errors.number = "Valid phone number is required.";
        }

        if (!country || country.trim() === "") {
          errors.country = "Country is required.";
        }
        if (!state || state.trim() === "") {
          errors.state = "State is required.";
        }
        if (!city || city.trim() === "") {
          errors.city = "City is required.";
        }

        if (!address1 || address1.trim() === "") {
          errors.address1 = "Address 1 is required.";
        }

        // Check if email already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
          errors.email = "Email is already in use.";
        }

        // If any errors exist, throw them
        if (Object.keys(errors).length > 0) {
          const firstField = Object.keys(errors)[0];
          throw new UserInputError(errors[firstField], { field: firstField });
        }

        let hashedPassword = null;
        if (password) {
          const saltRounds = 10;
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const newUser = await Users.create({
          firstname,
          lastname,
          email,
          password: hashedPassword,
          role,
          company_name,
          country_code,
          number,
          alt_country_code,
          alt_number,
          country,
          state,
          city,
          zipcode,
          address1,
          address2,
          ult_parent_id: ult_parent_id === "0" ? null : ult_parent_id,
          parent_id: parent_id === "0" ? null : parent_id,
          status,
          client_upstatus,
          dob,
          callback,
          no_of_calls,
          gender,
          // New fields
          title,
          description,
          experience,
          T_Projects,
          S_Client_satisfaction,
        });

        return {
          ...newUser.dataValues,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error(error.message || "Failed to create user.");
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
          throw new Error("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        let token;

        // 🔥 THIS IS THE IMPORTANT PART
        if (user.role === 5) {
          token = generateToken(user, "student"); // student secret
        } else {
          token = generateToken(user); // default SECRET_KEY
        }

        return {
          id: user.id,
          firstname: user.firstname,
          email: user.email,
          role: user.role,
          token,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed.");
      }
    },
    updateUserStatus: async (_, { id, status }) => {
      try {
        const [updated] = await Users.update(
          { status }, // Fields to update
          { where: { id: id } }, // Condition
        );

        if (updated === 0) {
          throw new UserInputError("User not found or status unchanged.");
        }

        // Fetch the updated user to return fields
        const updatedUser = await Users.findByPk(id, {
          attributes: ["id", "status"], // Only return needed fields
        });

        return updatedUser;
      } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Failed to update user status.");
      }
    },
    updateUserupStatus: async (_, { id, client_upstatus }) => {
      try {
        const [updated] = await Users.update(
          { client_upstatus }, // Fields to update
          { where: { id: id } }, // Condition
        );

        if (updated === 0) {
          throw new UserInputError("User not found or status unchanged.");
        }

        // Fetch the updated user to return fields
        const updatedUser = await Users.findByPk(id, {
          attributes: ["id", "client_upstatus"], // Only return needed fields
        });

        return updatedUser;
      } catch (error) {
        console.error("Error updating user status:", error);
        throw new Error("Failed to update user status.");
      }
    },
    updateUser: async (_, { id, userInput }) => {
      try {
        const user = await Users.findByPk(id);
        if (!user) {
          throw new UserInputError("User not found.");
        }

        const {
          firstname,
          lastname,
          email,
          company_name,
          country_code,
          number,
          alt_country_code,
          alt_number,
          country,
          state,
          city,
          zipcode,
          address1,
          address2,
          status,
          client_upstatus,
          dob,
          callback,
          no_of_calls,
          gender,
          created_at,
          updated_at,
          // New fields
          title,
          description,
          experience,
          T_Projects,
          S_Client_satisfaction,
        } = userInput;

        const errors = {};

        if (!firstname || firstname.trim() === "") {
          errors.firstname = "First name is required.";
        }
        if (!email || email.trim() === "") {
          errors.email = "Email is required.";
        }

        // Check if email is being changed to one that already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser && existingUser.id !== id) {
          errors.email = "Email is already in use by another account.";
        }

        if (Object.keys(errors).length > 0) {
          const firstField = Object.keys(errors)[0];
          throw new UserInputError(errors[firstField], { field: firstField });
        }

        await Users.update(
          {
            firstname,
            lastname,
            email,
            company_name,
            country_code,
            number,
            alt_country_code,
            alt_number,
            country,
            state,
            city,
            zipcode,
            address1,
            address2,
            status,
            client_upstatus,
            dob,
            callback,
            no_of_calls,
            gender,
            created_at,
            updated_at,
            // New fields
            title,
            description,
            experience,
            T_Projects,
            S_Client_satisfaction,
          },
          { where: { id } },
        );

        const updatedUser = await Users.findByPk(id);
        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error(error.message || "Failed to update user.");
      }
    },
  },
};

export default resolvers;

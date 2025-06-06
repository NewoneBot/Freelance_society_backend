import bcrypt from "bcrypt";
import Users from "../../../../db/models/Users.js";
import { generateToken } from "../../../../util/helper.js";

import { UserInputError } from "apollo-server";

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await Users.findAll({
          order: [["id", "DESC"]],
        });
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users.");
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
  },
  Mutation: {
    createUser: async (_, { userInput }) => {
      try {
        const {
          firstname,
          lastname,
          email,
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
          ult_parent_id,
          status,
          client_upstatus,
          dob,
          no_of_calls,
          callback,
          gender,
          parent_id,
        } = userInput;

        const errors = {};

        // Field validations
        if (!firstname || firstname.trim() === "") {
          errors.firstname = "First name is required.";
        }
        if (!email || email.trim() === "") {
          errors.email = "Email is required.";
        }
        if (!company_name || company_name.trim() === "") {
          errors.company_name = "Company name is required.";
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

        const newUser = await Users.create({
          firstname,
          lastname,
          email,
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
        // Check if user exists
        const user = await Users.findOne({ where: { email } });
        if (!user) {
          throw new Error("User not found.");
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        // Generate JWT token
        const token = generateToken(user);

        return {
          id: user.id,
          firstname: user.firstname,
          email: user.email,
          password: user.password,
          role: user.role,
          number: user.number,
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
          { where: { id: id } } // Condition
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
          { where: { id: id } } // Condition
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
        } = userInput;

        const errors = {};

        if (!firstname || firstname.trim() === "") {
          errors.firstname = "First name is required.";
        }
        if (!email || email.trim() === "") {
          errors.email = "Email is required.";
        }
        // You can add more validation if you want, e.g.:
        // if (!number || number.toString().length < 7) { errors.number = "Valid phone number is required."; }
        // if (!country || country.trim() === "") { errors.country = "Country is required."; }
        // etc.

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
          },
          { where: { id } }
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

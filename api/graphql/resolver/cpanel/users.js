import bcrypt from "bcrypt";
import Users from "../../../../db/models/Users.js";
import { generateToken } from "../../../../util/helper.js";
import { validateUserInput } from "../../../../util/validateUserInput.js";
import { UserInputError } from "apollo-server";

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await Users?.findAll({
          order: [['id', 'DESC']],
        });
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users.");
      }
    },
  },
  Mutation: {
    createUser: async (_, { userInput }) => {
      try {
        // Validate user input using the helper function
        const errors = validateUserInput(userInput);

        // Check if email already exists
        const { email } = userInput;
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
          errors.email = "Email is already in use.";
        }

        // If there are any validation errors, throw them
        if (Object.keys(errors).length > 0) {
          const firstField = Object.keys(errors)[0];
          throw new UserInputError(errors[firstField], { field: firstField });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userInput.password, 10);

        // Create new user
        const newUser = await Users.create({
          ...userInput,
          password: hashedPassword,
          ult_parent_id: userInput.ult_parent_id === "0" ? null : userInput.ult_parent_id,
          parent_id: userInput.parent_id === "0" ? null : userInput.parent_id,
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
  },
};

export default resolvers;

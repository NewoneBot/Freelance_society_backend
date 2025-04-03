import bcrypt from "bcrypt";
import Users from "../../../../db/models/Users.js";
import { generateToken } from "../../../../util/helper.js";

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await Users.findAll({
          attributes: {
            exclude: ["password"], // Exclude password field
          },
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
          const {
              firstname, lastname, email, password, role, company_name,
              country_code, number, country, state, city, zipcode, address1,
              ult_parent_id, status, dob, gender,parent_id,
          } = userInput;
  
          // Check if email already exists
          const existingUser = await Users.findOne({ where: { email } });
          if (existingUser) {
              throw new Error("Email is already in use.");
          }
  
          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);
  
          // Create new user
          const newUser = await Users.create({
              firstname,
              lastname,
              email,
              password: hashedPassword,
              role,
              company_name,
              country_code,
              number,
              country,
              state,
              city,
              zipcode,
              address1,
              ult_parent_id:ult_parent_id === "0" ? null : ult_parent_id,
              parent_id: parent_id === "0" ? null : parent_id,
              status,
              dob,
              gender
          });
  
          return {
              id: newUser.id,
              firstname: newUser.firstname,
              lastname: newUser.lastname,
              email: newUser.email,
              role: newUser.role,
              password: newUser.password, // Be careful exposing passwords
              company_name: newUser.company_name,
              country_code: newUser.country_code,
              number: newUser.number,
              country: newUser.country,
              state: newUser.state,
              city: newUser.city,
              zipcode: newUser.zipcode,
              address1: newUser.address1,
              parent_id: newUser.parent_id,
              ult_parent_id: newUser.ult_parent_id,
              status: newUser.status,
              dob: newUser.dob,
              gender: newUser.gender,
              created_at: newUser.created_at,
              updated_at: newUser.updated_at,
          };
      } catch (error) {
          console.error("Error creating user:", error);
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
    
  }

};

export default resolvers;

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
        const { firstname, lastname, email, password, role, callback, number } = userInput;

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
          callback,
          number,
        });

        return {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          role: newUser.role,
          callback: newUser.callback,
          created_at: newUser.created_at,
          number: newUser.number,
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
          number: user.number,
          token,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed.");
      }
    },
    insertClient: async (_, { clientInput }) => {
      try {
        const {  
          id,
          firstname,
          lastname,
          email,
          country_code,
          number,
          password,
          country,
          state,
          city,
          zipcode,
          gender,
          dob,
          company_name,
          created_at,
          updated_at, 
        } = clientInput;
    
        // Set default values
        const role = clientInput.role ?? 4; // Default role = 4
    
        // Check if client already exists
        const existingClient = await Users.findOne({ where: { email } });
        if (existingClient) {
          throw new Error("Client with this email already exists.");
        }
    
        // Create new client
        const newClient = await Users.create({
          id,
          firstname,
          lastname,
          email,
          country_code,
          number,
          password,
          country,
          state,
          city,
          zipcode,
          role, // Ensure role is set
          gender,
          dob,
          company_name,
          created_at: created_at ?? new Date().toISOString(), // Default created_at
          updated_at: updated_at ?? new Date().toISOString(), // Default updated_at
        });
    
        return {
          id: newClient.id,
          firstname: newClient.firstname,
          lastname: newClient.lastname,
          email: newClient.email,
          country_code: newClient.country_code,
          number: newClient.number,
          password: newClient.password,
          country: newClient.country,
          state: newClient.state,
          city: newClient.city,
          zipcode: newClient.zipcode,
          role: newClient.role, // Ensuring role is returned
          gender: newClient.gender,
          dob: newClient.dob,
          company_name: newClient.company_name,
          created_at: newClient.created_at,
          updated_at: newClient.updated_at,
        };
      } catch (error) {
        console.error("Error inserting client:", error);
        throw new Error(error.message || "Failed to insert client.");
      }
    },
    
  }

};

export default resolvers;

import { Op } from "sequelize";
import { Users } from "../../../../db/models/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../../util/helper.js";

const studentResolvers = {
  Query: {
    getAllStudents: async () => {
      try {
        const users = await Users.findAll({
          where: {
            role: {
              [Op.in]: [1, 2, 3, 5],
            },
          },
          order: [["id", "DESC"]],
          include: [
            {
              association: "socialLinks",
              attributes: ["platform", "url"],
            },
          ],
        });

        const totalCount = await Users.count({
          where: {
            role: {
              [Op.in]: [1, 2, 3, 5],
            },
          },
        });

        return {
          users,
          totalCount,
        };
      } catch (error) {
        console.error("Error fetching all students:", error);
        throw new Error("Failed to fetch all students.");
      }
    },
    getStudentsProfile: async (_, { id, limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            ...(id?.length && { id: { [Op.in]: id } }), // Optional filtering by IDs
            role: {
              [Op.in]: [1, 2, 3, 5],
            },
          },
          order: [["id", "DESC"]],
          limit,
          offset,
          include: [
            {
              association: "socialLinks",
              attributes: ["platform", "url"],
            },
          ],
        });

        return { users };
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users.");
      }
    },
  },
  Mutation: {
    studentLogin: async (_, { email, password }) => {
      try {
        // 1. Find student by email
        const student = await Users.findOne({
          where: { email, role: 5 }, // assuming role 5 = student
          include: [
            {
              association: "socialLinks",
              attributes: ["platform", "url"],
            },
          ],
        });

        if (!student) {
          throw new Error("Student not found.");
        }

        // 2. Verify password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        // 3. Generate student token
        const studentToken = generateToken(student, "student");

        // 4. Return response
        return {
          id: student.id,
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
          number: student.number,
          role: student.role,
          studentToken,
        };
      } catch (error) {
        console.error("Student login error:", error);
        throw new Error(error.message || "Student login failed.");
      }
    },
    addSkill: async (_, { skill }, { token }) => {
      try {
        if (!token) throw new Error("Unauthorized");

        // Decode token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Verify user exists
        const user = await Users.findByPk(userId);
        if (!user) throw new Error("User not found");

        // Save skill in DB
        const newSkill = await Skills.create({
          user_id: userId,
          skill: skill,
        });

        return {
          success: true,
          message: "Skill added successfully",
          skill: newSkill,
        };
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Something went wrong");
      }
    },
  },
};

export default studentResolvers;

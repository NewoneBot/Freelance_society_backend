import { Op } from "sequelize";
import { Skills, UserSkills, Users } from "../../../../db/models/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../../util/helper.js";
import Projects from "../../../../db/models/Projects.js";
import checkauth from "../../../../util/checkauth.js";

const studentResolvers = {
  Query: {
    getStudentsProfile: async (_, { id, limit, offset }, { headers }) => {
      const userData = await checkauth(headers.authorization);
      console.log("Request made by user:", userData?.id);

      try {
        const users = await Users.findAll({
          where: {
            ...(id?.length && { id: { [Op.in]: id } }),
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
    getUserSkills: async (_, __, { headers }) => {
      const userData = await checkauth(headers.authorization);
      console.log(userData?.id);
      try {
        const userSkills = await UserSkills.findAll({
          where: { user_id: userData.id }, // filter by user ID
          include: [
            {
              model: Skills,
              as: "skill", // must match your association
              attributes: ["id", "name"], // only fetch needed columns
            },
          ],
        });
        return userSkills;
      } catch (err) {
        console.error("Error fetching user skills:", err);
        throw new Error("Unable to fetch user skills");
      }
    },
    getProjectsByUser: async (_, __, { headers }) => {
      const userData = await checkauth(headers.authorization);
      try {
        const projects = await Projects.findAll({
          where: { user_id: userData.id },
          order: [["id", "DESC"]],
        });
        return projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Unable to fetch projects");
      }
    },

    getDashboardDetails: async (_, __, { headers }) => {
      const userData = await checkauth(headers.authorization);
      console.log("Decoded user data:", userData);
      try {
        const user = await Users.findOne({
          where: { id: userData.id },
          attributes: [
            "firstname",
            "lastname",
            "email",
            "country_code",
            "number",
            "title",
            "description",
            "experience",
            "T_Projects",
            "S_Client_satisfaction",
          ],
        });

        if (!user) {
          throw new Error("User not found");
        }

        const userSkills = await UserSkills.findAll({
          where: { user_id: userData.id }, // fixed
          include: [
            {
              model: Skills,
              as: "skill",
              attributes: ["id", "name"],
            },
          ],
        });

        const totalSkills = userSkills.length;

        const projects = await Projects.findAll({
          where: { user_id: userData.id }, // fixed
          order: [["id", "DESC"]],
        });

        return {
          user,
          skills: userSkills,
          totalSkills,
          projects,
        };
      } catch (err) {
        console.error("Error fetching portfolio details:", err);
        throw new Error("Unable to fetch portfolio details");
      }
    },
    getPortfolioDetails: async (_, { userId }) => {
      try {
        const user = await Users.findOne({
          where: { id: userId },
          attributes: [
            "firstname",
            "lastname",
            "title",
            "description",
            "experience",
            "T_Projects",
            "S_Client_satisfaction",
          ],
        });

        if (!user) {
          throw new Error("User not found");
        }

        const userSkills = await UserSkills.findAll({
          where: { user_id: userId },
          include: [
            {
              model: Skills,
              as: "skill",
              attributes: ["id", "name"],
            },
          ],
        });

        const totalSkills = userSkills.length;

        const projects = await Projects.findAll({
          where: { user_id: userId },
          order: [["id", "DESC"]],
        });

        return {
          user,
          skills: userSkills,
          totalSkills,
          projects,
        };
      } catch (err) {
        console.error("Error fetching portfolio details:", err);
        throw new Error("Unable to fetch portfolio details");
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
    addUserSkills: async (_, { skills }, { headers }) => {
      // Authenticate user via header
      const userData = await checkauth(headers.authorization);
      console.log("Request made by user:", userData?.id);

      const user = await Users.findByPk(userData.id);
      if (!user) throw new Error("User not found");

      // Create or find skills
      const skillRecords = await Promise.all(
        skills.map(async (name) => {
          const [skill] = await Skills.findOrCreate({ where: { name } });
          return skill;
        })
      );

      // Add skills to user
      await user.addSkills(skillRecords);

      // Fetch updated user with skills
      const userWithSkills = await Users.findByPk(userData.id, {
        include: [{ model: Skills, as: "skills", through: { attributes: [] } }],
      });

      return { user: userWithSkills };
    },
    deleteUserSkills: async (_, { skills }, { headers }) => {
      // Authenticate user
      const userData = await checkauth(headers.authorization);
      console.log("Delete skills request by user:", userData?.id);

      const user = await Users.findByPk(userData.id);
      if (!user) throw new Error("User not found");

      // Fetch skills to delete
      const skillRecords = await Skills.findAll({
        where: { name: skills },
      });

      if (skillRecords.length === 0) {
        throw new Error("No matching skills found to delete");
      }

      // Remove skills association
      await user.removeSkills(skillRecords);

      // Fetch updated user with remaining skills
      const userWithSkills = await Users.findByPk(userData.id, {
        include: [{ model: Skills, as: "skills", through: { attributes: [] } }],
      });

      return { user: userWithSkills };
    },
    addUserProjects: async (_, { projects }, { headers }) => {
      // Authenticate user via header
      const userData = await checkauth(headers.authorization);
      if (!userData) throw new Error("Unauthorized");

      const user = await Users.findByPk(userData.id);
      if (!user) throw new Error("User not found");

      // Create project records
      const projectRecords = await Promise.all(
        projects.map(async ({ title, description, link, technologies }) => {
          return Projects.create({
            user_id: user.id,
            title,
            description,
            link,
            technologies: technologies || [],
          });
        })
      );

      // Fetch updated user with projects
      const userWithProjects = await Users.findByPk(user.id, {
        include: [{ model: Projects, as: "projects" }],
      });

      return { user: userWithProjects };
    },
    deleteUserProject: async (_, { projectId }, { headers }) => {
      // 1. Authenticate user from headers
      const userData = await checkauth(headers.authorization);
      if (!userData) throw new Error("Unauthorized");

      // 2. Ensure user exists
      const user = await Users.findByPk(userData.id);
      if (!user) throw new Error("User not found");

      // 3. Find project to ensure it belongs to user
      const project = await Projects.findOne({
        where: { id: projectId, user_id: user.id },
      });
      if (!project) throw new Error("Project not found or not owned by user");

      // 4. Delete the project
      await project.destroy();

      // 5. Fetch updated user with projects
      const updatedUser = await Users.findByPk(user.id, {
        include: [{ model: Projects, as: "projects" }],
      });

      return { user: updatedUser };
    },
    editUserProject: async (_, { projectId, input }, { headers }) => {
      // 1. Authenticate user
      const userData = await checkauth(headers.authorization);
      if (!userData) throw new Error("Unauthorized");

      // 2. Ensure user exists
      const user = await Users.findByPk(userData.id);
      if (!user) throw new Error("User not found");

      // 3. Find project to ensure it belongs to user
      const project = await Projects.findOne({
        where: { id: projectId, user_id: user.id },
      });
      if (!project) throw new Error("Project not found or not owned by user");

      // 4. Update project with provided input
      await project.update({
        title: input.title || project.title,
        description: input.description || project.description,
        link: input.link || project.link,
        // add other fields as needed
      });

      // 5. Fetch updated user with projects
      const updatedUser = await Users.findByPk(user.id, {
        include: [{ model: Projects, as: "projects" }],
      });

      return { user: updatedUser };
    },
  },
};

export default studentResolvers;

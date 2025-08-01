import { Op } from "sequelize";
import { Users } from "../../../../db/models/index.js";

const studentResolvers = {
  Query: {
    getStudents: async (_, { limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            role: {
              [Op.in]: [1, 2, 3, 5],
            },
          },
          order: [["id", "DESC"]],
          limit,
          offset,
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
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users.");
      }
    },
    getUserWithSocialLinks: async (_, { userId }) => {
      try {
        const user = await Users.findOne({
          where: { id: userId },
          include: [
            {
              association: "socialLinks", // Defined in Users.hasMany(...)
              attributes: ["platform", "url"], // You still control what you want from SocialLinks
            },
          ],
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error("Error fetching user and social links:", error);
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {},
};

export default studentResolvers;

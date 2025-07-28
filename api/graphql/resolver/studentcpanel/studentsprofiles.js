import { Op } from "sequelize";
import Users from "../../../../db/models/Users.js";

const studentResolvers = {
  Query: {
    getStudents: async (_, { limit, offset }) => {
      try {
        const users = await Users.findAll({
          where: {
            role: {
              [Op.in]: [1, 2, 3 , 5],
            },
          },
          order: [["id", "DESC"]],
          limit,
          offset,
        });

        const totalCount = await Users.count({
          where: {
            role: {
              [Op.in]: [1, 2, 3 , 5],
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
  },

  Mutation: {
    
  },
};

export default studentResolvers;

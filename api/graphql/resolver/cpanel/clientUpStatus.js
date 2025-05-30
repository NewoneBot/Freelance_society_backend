import Clientupstatus from "../../../../db/models/Clientupstatus.js";

const getClientUpStatusData = {
  Query: {
    getClientUpStatuses: async () => {
      try {
        const allStatuses = await Clientupstatus.findAll({
          order: [['id', 'ASC']],
        });
        return allStatuses;
      } catch (error) {
        console.error("Error fetching client up status:", error);
        throw new Error("Unable to fetch client up status");
      }
    },
  },
  Mutation: {},
};

export default getClientUpStatusData;

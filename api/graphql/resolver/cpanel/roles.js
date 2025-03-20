import Role from "../../../../db/models/Role.js";

const getalldata = {
  Query : {
    getRole: async (_,) => {
          try {
            const getAllRoles = await Role.findAll();
            console.log(getAllRoles);
            return getAllRoles;
          } catch (error) {
            console.log(error);
          }
        },
  },
  Mutation : {

  },
};

export default getalldata;
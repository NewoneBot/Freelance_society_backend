import userResolvers from "./users.js";
import rolesResolvers from "./roles.js";

export default {
  Query: {
    ...userResolvers.Query,
    ...rolesResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rolesResolvers.Mutation,
  },
};

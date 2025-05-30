import userResolvers from "./users.js";
import rolesResolvers from "./roles.js";
import ClientUpStatusresolvers from "./clientUpStatus.js";

export default {
  Query: {
    ...userResolvers.Query,
    ...rolesResolvers.Query,
    ...ClientUpStatusresolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rolesResolvers.Mutation,
    ...ClientUpStatusresolvers.Mutation,
  },
};

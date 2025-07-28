import userResolvers from "./users.js";
import rolesResolvers from "./roles.js";
import ClientUpStatusresolvers from "./clientUpStatus.js";
import studentResolvers from "../studentcpanel/studentsprofiles.js";

export default {
  Query: {
    ...userResolvers.Query,
    ...rolesResolvers.Query,
    ...ClientUpStatusresolvers.Query,
    ...studentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...rolesResolvers.Mutation,
    ...ClientUpStatusresolvers.Mutation,
    ...studentResolvers.Mutation,
  },
};

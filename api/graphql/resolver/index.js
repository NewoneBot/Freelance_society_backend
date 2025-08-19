import userResolvers from "./cpanel/users.js";
import rolesResolvers from "./cpanel/roles.js";
import ClientUpStatusresolvers from "./cpanel/clientUpStatus.js";
import studentResolvers from "./studentcpanel/studentsprofiles.js";

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

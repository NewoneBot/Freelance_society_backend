import userResolvers from "./users"
import rolesResolvers from "./roles"


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
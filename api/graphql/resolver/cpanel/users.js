const resolvers = {
  Query: {
    users: async (parent, args, context, info) => {
      return [{ id: 1, name: "John Doe" }];
    },
  },
};

export default resolvers;

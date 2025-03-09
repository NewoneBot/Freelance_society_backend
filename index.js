import { ApolloServer } from "apollo-server";
import typeDefs from "./api/typeDef.js";
import cpanelResolver from "./api/graphql/resolver/cpanel/index.js";

// Resolvers
const resolvers = {
  Query: {
    ...cpanelResolver.Query,
  },
  Mutation: {
    ...cpanelResolver.Mutation, // Fix: Mutation me bhi Mutation likhna hai Query nahi
  },
};

// GraphQL server configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  status400ForVariableCoercionErrors: true,
  context: ({ req }) => {
    return {}; // Custom context function
  },
  debug: true,
});

// Start the Server
const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

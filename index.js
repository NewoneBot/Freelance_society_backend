const { ApolloServer, gql } = require("apollo-server");
import typeDefs from "./api/typeDef.js";
import cpanelResolver from "./api/graphql/resolver/cpanel/index.js";


// Resolvers
const resolvers = {
  Query: {
    ...cpanelResolver.Query,
  },
  Mutation: {
    ...cpanelResolver.Query
  }
}


//Graphql server configuration
export const server = new ApolloServer({
  url: `${process.env.SERVER_END_DOMAIN}:${process.env.SERVER_PORT}/graphql`,
  typeDefs,
  resolvers,
  status400ForVariableCoercionErrors: true,
  context: ({ req }) => {
    const { cache } = server;
    return myContext(req, cache);
  },
  plugins: [],
  debug: true,
});

// Start the Server
server.listen().then(({ url }) => {
  console.log(`🚀 server ${url}`);
});

// httpServer.listen({ port: process.env.SERVER_PORT }, () => {
//   console.log(
//     `🚀 Server ready at ${process.env.SERVER_END_DOMAIN}:${process.env.SERVER_PORT}`
//   );
// });



import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import jwt from "jsonwebtoken";
import typeDefs from "./api/typeDef.js";
import cpanelResolver from "./api/graphql/resolver/index.js";
import sequelizeObj from "./db/index.js";

const resolvers = {
  Query: { ...cpanelResolver.Query },
  Mutation: { ...cpanelResolver.Mutation },
};
// or apollo-server-express if using Express


const myContext = (req, cache) => {
  return {
    sequelizeObj,
    headers: req.headers
  }
}



const server = new ApolloServer({
  typeDefs,
  resolvers,
 context: ({req})=> {
  const {cache} = server;
  return myContext(req, cache);
  },
  debug: true,
});


const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

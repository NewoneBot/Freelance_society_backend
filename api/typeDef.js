import { gql } from "graphql-tag";

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Role {
    id: ID!
    name: String!
  }

  type Query {
    users: [User]
    roles: [Role]
  }

  type Mutation {
    _empty: String
  }
`;

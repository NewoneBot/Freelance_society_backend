import { gql } from "graphql-tag";

export default gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String
    email: String!
    password: String
    date: String
    callback: String
    company_name: String
    no_of_calls: Int
    role: Int!
    revert: String
    country_code: String
    number: String
    alt_country_code: String
    alt_number: String
    avatar: String
    country: String
    state: String
    city: String
    zipcode: String
    address1: String
    address2: String
    parent_id: String
    ult_parent_id: String
    status: Int
    client_upstatus: Int
    dob: String
    gender: String
    created_at: String
    updated_at: String
    token: String
  }

  input UserInput {
    id: ID
    firstname: String!
    lastname: String
    email: String!
    role: Int!
    date: String
    callback: String
    company_name: String
    no_of_calls: Int
    revert: String
    country_code: String
    number: String
    alt_country_code: String
    alt_number: String
    avatar: String
    country: String
    state: String
    city: String
    zipcode: String
    address1: String
    address2: String
    ult_parent_id: String
    parent_id: String
    status: Int
    client_upstatus: Int
    dob: String
    gender: String
    created_at: String
    updated_at: String
  }

  input UpdateUserInput {
    firstname: String
    lastname: String
    email: String
    company_name: String
    country_code: String
    number: String
    alt_country_code: String
    alt_number: String
    country: String
    state: String
    city: String
    zipcode: String
    address1: String
    address2: String
    status: Int
    client_upstatus: Int
    dob: String
    callback: String
    no_of_calls: Int
    gender: String
    created_at: String
    updated_at: String
  }

  type Role {
    id: ID!
    role_name: String!
    role_description: String
    created_at: String
    updated_at: String
  }

  type ClientUpStatus {
    id: Int!
    cl_status: String!
    desc: String!
  }

  type Query {
    getRole: [Role]
    getUsers: [User]
    getClientUpStatuses: [ClientUpStatus]
    getUserById(id: Int!): User
  }

  type Mutation {
    createUser(userInput: UserInput): User
    login(email: String!, password: String!): User!
    updateUserStatus(id: ID!, status: Int!): User
    updateUserupStatus(id: ID!, client_upstatus: Int!): User
    updateUser(id: Int!, userInput: UpdateUserInput!): User
  }
`;

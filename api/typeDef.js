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
    socialLinks: [SocialLink]
    title: String
    description: String
    experience: Int
    T_Projects: Int
    S_Client_satisfaction: Int
    skills: [Skill!]
    projects: [Project!]
  }

  type SocialLink {
    platform: String
    url: String
  }

  type StudentsProfileResponse {
    users: [User]
    totalCount: Int
  }

  type AllStudentsResponse {
    users: [User]
    totalCount: Int
  }

  input UserInput {
    id: ID
    firstname: String!
    lastname: String
    email: String!
    password: String
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
    title: String
    description: String
    experience: Int
    T_Projects: Int
    S_Client_satisfaction: Int
  }

  input UpdateUserInput {
    id: ID
    firstname: String
    lastname: String
    email: String
    role: Int
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
    title: String
    description: String
    experience: Int
    T_Projects: Int
    S_Client_satisfaction: Int
  }

  input ProjectInput {
    title: String!
    description: String
    link: String
    technologies: [String!]
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

  type PaginatedUsers {
    users: [User]
    totalCount: Int
    followUpCount: Int
  }

  type AddSkillResponse {
    success: Boolean!
    message: String!
    skill: Skill
  }

  type AddUserSkillsResponse {
    user: User!
  }

  type UserSkillsResponse {
    user: User!
  }

  type Skill {
    id: Int!
    name: String!
  }

  type UserSkill {
    id: ID!
    user_id: ID!
    skill_id: ID!
    skill: Skill
  }

  type AddSkillsResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type AddUserProjectsResponse {
    user: User
  }

  type UserWithProjectsResponse {
    user: User
  }

  type EditUserProjectPayload {
    user: User!
  }

  input EditProjectInput {
    title: String
    description: String
    link: String
    technologies: [String]
  }

  type Project {
    id: ID!
    user_id: Int
    title: String!
    description: String
    link: String
    technologies: [String]
    created_at: String
    updated_at: String
  }

  input EditUserProfileInput {
    firstname: String
    lastname: String
    email: String
    number: String
    title: String
    description: String
    experience: Int
    T_Projects: Int
    S_Client_satisfaction: Int
    avatar: String
  }

  type EditUserProfilePayload {
    user: User!
  }

  type UserBasicInfo {
    avatar: String
    firstname: String!
    lastname: String
    email: String
    country_code: String
    number: String
    title: String
    description: String
    experience: Int
    T_Projects: Int
    S_Client_satisfaction: Int
  }

  type UserWithSkillsResponse {
    user: User!
  }

  type UserResponse {
    user: User
  }

  type UserFullDetails {
    user: UserBasicInfo!
    skills: [UserSkill!]!
    totalSkills: Int!
    projects: [Project!]!
  }

  type ClientStatusCounts {
    totalUsers: Int
    followUp: Int
    interested: Int
    longFollowUp: Int
    deleted: Int
    closed: Int
    todayInterested: Int
    todayLongFollowUp: Int
  }

  type StudentLoginResponse {
    id: ID!
    firstname: String!
    lastname: String
    email: String!
    number: String
    role: Int!
    studentToken: String!
  }

input UpdateProjectInput {
  id: ID
  title: String!
  description: String
  link: String
}

  type Query {
    getRole: [Role]
    getMembers(limit: Int, offset: Int): PaginatedUsers
    getClient(limit: Int, offset: Int): PaginatedUsers
    getProfileList(limit: Int, offset: Int): PaginatedUsers
    getClientUpStatuses: [ClientUpStatus]
    getUserById(id: Int!): User
    getClientStatusCounts: ClientStatusCounts
    getAllStudents: AllStudentsResponse
    getUserWithSocialLinks(userId: Int!): User
    getStudentsProfile(id: [Int], limit: Int, offset: Int): PaginatedUsers
    getAllUserSkills: [UserSkill]!
    getUserSkills: [UserSkill]!
    getProjects: [Project]
    getProjectsByUser: [Project]
    getPortfolioDetails(userId: ID!): UserFullDetails!
    getDashboardDetails: UserFullDetails!
  }

  type Mutation {
    createUser(userInput: UserInput): User
    login(email: String!, password: String!): User!
    updateUserStatus(id: ID!, status: Int!): User
    updateUserupStatus(id: ID!, client_upstatus: Int!): User
    updateUser(id: Int!, userInput: UpdateUserInput!): User
    studentLogin(email: String!, password: String!): StudentLoginResponse
    addUserSkills(skills: [String!]!): AddUserSkillsResponse!
    deleteUserSkills(skills: [String!]!): UserSkillsResponse!
    addUserProjects(projects: [ProjectInput!]!): AddUserProjectsResponse
    deleteUserProject(projectId: ID!): UserWithProjectsResponse
    editUserProject(
      projectId: ID!
      input: EditProjectInput!
    ): EditUserProjectPayload!
    editUserProfile(input: EditUserProfileInput!): EditUserProfilePayload!
    updateUserAvatar(avatar: String!): UserResponse
  }
`;

import { DataTypes } from "sequelize";
import sequelize from "../index.js";
import Skills from "./Skills.js";
import UserSkills from "./UserSkills.js";
import Projects from "./Projects.js";

const Users = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING(225),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ult_parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    callback: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    no_of_calls: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    revert: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    number: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    alt_country_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alt_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    zipcode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    client_upstatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    // New fields added below
    title: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    T_Projects: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    S_Client_satisfaction: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

Users.belongsToMany(Skills, {
  through: UserSkills,
  foreignKey: "user_id",
  otherKey: "skill_id",
});



export default Users;

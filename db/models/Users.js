import { DataTypes } from "sequelize";
import sequelize from "../index.js";

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
      type: DataTypes.STRING(225),
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
    timestamps: false, // Since we have created_at & updated_at manually
  }
);

export default Users;

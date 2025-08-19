import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const Skills = sequelize.define(
  "Skills",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Matches skills_name_key constraint
    },
  },
  {
    tableName: "skills",
    timestamps: false, // No created_at/updated_at in your table
  }
);

export default Skills;

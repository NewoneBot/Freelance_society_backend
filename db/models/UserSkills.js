import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const UserSkills = sequelize.define(
  "UserSkills",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "user_skills",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "skill_id"], // Matches user_skills_user_id_skill_id_key
      },
    ],
  }
);

export default UserSkills;

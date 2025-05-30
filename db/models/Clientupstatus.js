import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const Clientupstatus = sequelize.define(
  "clientupstatus",
  {
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    cl_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "clientupstatus",
    timestamps: false
  },
);

export default Clientupstatus;

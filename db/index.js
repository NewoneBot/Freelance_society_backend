  import { Sequelize } from "sequelize";
  import dotenv from "dotenv";

  dotenv.config();
  const sequelizeObj = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,    
    {
      host: process.env.DB_HOST,
      dialect: "postgresql",
      logging: false,
      // dialectOptions: {
      //   project: "kidawesome-server",
      //   ssl: {
      //     require: false,
      //     rejectUnauthorized: false,
      //   },
      // },
    }
  );

  export default sequelizeObj;

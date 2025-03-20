import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      email: user.email,
      number: user.number,
      password: user.password, // Storing passwords in a token is NOT recommended
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
      socialLinks: user.socialLinks || [], // ✅ include if available
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

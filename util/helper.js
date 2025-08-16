import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user, type = "user") => {
  const payload = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    number: user.number,
    socialLinks: user.socialLinks || [],
  };

  const secret =
    type === "student"
      ? process.env.STUDENT_SECRET_KEY // 🔐 define this in .env
      : process.env.SECRET_KEY;

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

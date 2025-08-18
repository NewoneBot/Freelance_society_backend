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
    title: user.title,                
    description: user.description,    
    experience: user.experience,      
    T_Projects: user.T_Projects,      
    S_Client_satisfaction: user.S_Client_satisfaction,
  };

  const secret =
    type === "student"
      ? process.env.STUDENT_SECRET_KEY
      : process.env.SECRET_KEY;

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

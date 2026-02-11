import jwt from "jsonwebtoken";

export const generateToken = (user, type = "user") => {
  const payload = {
    id: user.id,
    avatar: user.avatar,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    number: user.number,
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

import Users from "./Users.js";
import SocialLinks from "./SocialLinks.js";
import Skills from "./Skills.js";
import UserSkills from "./UserSkills.js";
import Projects from "./Projects.js"; // import Projects here

// Users → SocialLinks
Users.hasMany(SocialLinks, {
  foreignKey: "user_id",
  as: "socialLinks",
});
SocialLinks.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// Users ↔ Skills via UserSkills
Users.belongsToMany(Skills, {
  through: UserSkills,
  foreignKey: "user_id",
  otherKey: "skill_id",
  as: "skills",
});
Skills.belongsToMany(Users, {
  through: UserSkills,
  foreignKey: "skill_id",
  otherKey: "user_id",
  as: "users",
});
UserSkills.belongsTo(Skills, { foreignKey: "skill_id", as: "skill" });

// Users → Projects
Users.hasMany(Projects, { foreignKey: "user_id", as: "projects" });
Projects.belongsTo(Users, { foreignKey: "user_id", as: "user" });

// Export all models
export { Users, SocialLinks, Skills, UserSkills, Projects };

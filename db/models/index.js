import Users from "./Users.js";
import SocialLinks from "./SocialLinks.js";
import Skills from "./Skills.js";
import UserSkills from "./UserSkills.js";

// Existing association (Users → SocialLinks)
Users.hasMany(SocialLinks, {
  foreignKey: "user_id",
  as: "socialLinks",
});

SocialLinks.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

// New association (Users ↔ Skills via UserSkills)
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

export { Users, SocialLinks, Skills, UserSkills };

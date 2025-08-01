import Users from "./Users.js";
import SocialLinks from "./SocialLinks.js";

// Define all associations here (centralized)
Users.hasMany(SocialLinks, {
  foreignKey: "user_id",
  as: "socialLinks",
});

SocialLinks.belongsTo(Users, {
  foreignKey: "user_id",
  as: "user",
});

export { Users, SocialLinks };

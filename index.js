import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import multer from "multer";
import cors from "cors"; // ✅ Import cors
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import typeDefs from "./api/typeDef.js";
import cpanelResolver from "./api/graphql/resolver/index.js";
import sequelizeObj from "./db/index.js";

const app = express();

// --------------------
// Enable CORS
// --------------------
app.use(
  cors({
    origin: ["http://localhost:3000", "https://studio.apollographql.com"], // allow your frontend + Sandbox
    credentials: true,
  })
);

// --------------------
// Multer & static uploads
// --------------------
const AVATAR_UPLOAD_PATH = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(AVATAR_UPLOAD_PATH));

const avatarUpload = multer({
  dest: AVATAR_UPLOAD_PATH,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// --------------------
// Upload controller
// --------------------
app.post("/uploads/avatar", avatarUpload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.json({ filePath: fileUrl });
});

// --------------------
// Apollo GraphQL setup
// --------------------
const resolvers = {
  Query: { ...cpanelResolver.Query },
  Mutation: { ...cpanelResolver.Mutation },
};

const myContext = (req) => ({
  sequelizeObj,
  headers: req.headers,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => myContext(req),
  debug: true,
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql", cors: false }); // disable Apollo CORS because Express handles it

  const PORT = process.env.SERVER_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
    console.log(`Avatar upload ready at http://localhost:${PORT}/uploads/avatar`);
  });
};

startServer();

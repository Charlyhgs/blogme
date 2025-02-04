const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");

const routes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);
};

module.exports = routes;

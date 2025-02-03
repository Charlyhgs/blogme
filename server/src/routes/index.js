const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const routes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
};

module.exports = routes;

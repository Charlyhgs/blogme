const jwtService = require("../services/jwtService");

const authMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided." });
    }

    try {
      const decoded = jwtService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: "Forbidden: Invalid or expired token." });
    }
  },

  authorizeRolesOrSelf:
    (...allowedRoles) =>
    (req, res, next) => {
      const { user } = req;
      const { id } = req.params;

      if (!user) {
        return res.status(403).json({ message: "Forbidden: Access denied." });
      }

      if (allowedRoles.includes(user.role)) {
        return next();
      }

      if (id && id === user.id) {
        return next();
      }

      return res.status(403).json({
        message:
          "Forbidden: You can only modify your own profile or be an admin.",
      });
    },
};

module.exports = authMiddleware;

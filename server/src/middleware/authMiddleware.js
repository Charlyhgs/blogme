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
};

module.exports = authMiddleware;

const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/", authController.emailAuth);

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);

router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;

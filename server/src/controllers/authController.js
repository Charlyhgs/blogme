const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const userService = require("../services/userService");
const jwtService = require("../services/jwtService");

const validateRequiredFields = (fields, res) => {
  for (const field of fields) {
    if (!field) {
      res.status(400).json({ message: "Missing required fields" });
      return false;
    }
  }
  return true;
};

const comparePasswords = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!validateRequiredFields([email, password], res)) return;

  try {
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const emailAuth = async (req, res) => {
  const { email, password } = req.body;

  if (!validateRequiredFields([email, password], res)) return;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);
    jwtService.setRefreshTokenCookie(res, refreshToken);

    res.json({ user, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

const googleAuth = (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
};

const googleAuthCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    res.json(data);
  })(req, res);
};

const githubAuth = (req, res) => {
  passport.authenticate("github")(req, res);
};

const githubAuthCallback = (req, res) => {
  passport.authenticate("github", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Github authentication failed" });
    }
    res.json(data);
  })(req, res);
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get token from cookie
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const newAccessToken = jwtService.generateAccessToken({ id: decoded.id });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or Expired Refresh Token" });
  }
};

// Logout (Clear the refresh token)
const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ message: "Logged out" });
};

module.exports = {
  register,
  emailAuth,
  googleAuth,
  googleAuthCallback,
  githubAuth,
  githubAuthCallback,
  refreshToken,
  logout,
};

const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "7h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  verifyAccessToken,
  verifyRefreshToken,
};

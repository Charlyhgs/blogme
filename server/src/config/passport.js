const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const userService = require("../services/userService");
const jwtService = require("../services/jwtService");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/user/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const avatar = profile.photos?.[0]?.value || null;

        if (!email) return done(new Error("No email provided by Google"), null);

        let user = await userService.getUserByEmail(email);
        if (!user) {
          user = await userService.createUser({
            provider: "google",
            providerId: profile.id,
            email,
            avatar,
          });
        }
        const accessToken = jwtService.generateAccessToken(user);
        const refreshToken = jwtService.generateRefreshToken(user);
        jwtService.setRefreshTokenCookie(res, refreshToken);

        return done(null, { id: user.id, accessToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/user/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const avatar = profile.photos?.[0]?.value || null;

        if (!email) return done(new Error("No email provided by GitHub"), null);

        let user = await userService.getUserByEmail(email);

        if (!user) {
          user = await userService.createUser({
            provider: "github",
            providerId: profile.id,
            email,
            avatar,
          });
        }

        const accessToken = jwtService.generateAccessToken(user);
        const refreshToken = jwtService.generateRefreshToken(user);
        jwtService.setRefreshTokenCookie(res, refreshToken);

        return done(null, { id: user.id, accessToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;

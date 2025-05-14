const DiscordStrategy = require("passport-discord").Strategy;

module.exports = function(passport) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: "https://TON_BACKEND_RENDER.onrender.com/auth/discord/redirect",
    scope: ['identify']
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
}

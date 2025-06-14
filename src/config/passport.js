import passport from "passport";
import User from "../modules/user/userModel.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REDIRECT_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        //
        existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
          //
          existingUser.googleId = profile.id;
          if (!existingUser.avatar) {
            existingUser.avatar = profile.photos[0].value;
          }
          await existingUser.save();
          return done(null, existingUser);
        }

        //
        const newUser = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

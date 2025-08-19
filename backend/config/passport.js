import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userSchema from "../models/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALL_BACK_URL,
            // passReqToCallback: false, // keep it simple
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new Error("Google account has no public email"));
                }

                let user = await userSchema.findOne({ email });
                if (!user) {
                    user = await userSchema.create({
                        userName: profile.displayName || email.split("@")[0],
                        email,
                        profilePicture: profile.photos?.[0]?.value,
                    });
                }

                return done(null, user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userSchema.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;

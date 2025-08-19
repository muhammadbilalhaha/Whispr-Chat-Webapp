import { Router } from "express";
import {
    createNewUser,
    loginUser,
    UserForgetPassword,
    userLogout,
    userResetPassword,
} from "../controllers/authentication.controller.js";
import passport from "passport";
import saveAndSendToken from "../utils/saveAndSendToken.js";

const router = Router();

// ========================
// Normal Auth Routes
// ========================
router.post("/newUserCreation", createNewUser);
router.post("/userLogin", loginUser);
router.post("/userForgetPassword", UserForgetPassword);
router.put("/userResetPassword/:token", userResetPassword);
router.post("/userLogout", userLogout);

// ========================
// Google OAuth Routes
// ========================
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    async (req, res) => {
        // User is available on req.user after passport
        const user = req.user;

        // Save token in cookie + send response using your helper
        // But since we are redirecting, we cannot send JSON.
        // So just save cookie and redirect.
        const token = user.generateToken();

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        };

        res.cookie("token", token, options);

        // Redirect back to frontend
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
);

export default router;

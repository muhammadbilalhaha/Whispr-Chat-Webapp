import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import userSchema from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandlerClass.js"
import { mailSender } from "../utils/mailSender.js";
import saveAndSendToken from "../utils/saveAndSendToken.js";
import crypto from "crypto";


// Creating New User Account
export const createNewUser = catchAsyncError(
    async (req, res, next) => {

        // getting user data from frontend
        const { userName, email, password, confirmPassword } = req.body;

        // if any field is missing, show error
        if (!userName || !email || !password || !confirmPassword) {
            return next(new ErrorHandler("Please Enter Complete Details!", 400));
        }

        // if password and confirmPassword do not match, show error
        if (password !== confirmPassword) {
            return next(new ErrorHandler("Passwords do not match!", 400));
        }

        // create new user in database
        let user = await userSchema.create({
            userName,
            email,
            password
        });

        // find the created user again but don't include password
        user = await userSchema.findOne({ email }).select("-password");

        // save token in cookie and send response
        saveAndSendToken(user, 200, res);
    }
)


// Login User 
export const loginUser = catchAsyncError(
    async (req, res, next) => {

        // get email and password from request
        const { email, password } = req.body;

        // if email is missing
        if (!email) {
            return next(new ErrorHandler("Please Enter Email!", 400));
        }
        // if password is missing
        if (!password) {
            return next(new ErrorHandler("Please Enter Password!", 400));
        }

        // convert email to lowercase (for consistency)
        const lowerCaseEmail = email.toLowerCase();

        // find user by email and also include password
        let user = await userSchema.findOne({ email: lowerCaseEmail }).select("+password");

        // if user not found
        if (!user) {
            return next(new ErrorHandler("Invalid Credentials!", 400));
        }

        // check if entered password matches
        const enteredPassword = await user.comparePassword(password);

        // if password doesn't match
        if (!enteredPassword) {
            return next(new ErrorHandler("Invalid Credentials!", 400));
        }

        // find user again and exclude password before sending response
        user = await userSchema.findOne({ email: lowerCaseEmail }).select("-password");

        // save token in cookie and send response
        saveAndSendToken(user, 200, res);
    }
)


// User Click Forget Password 
export const UserForgetPassword = catchAsyncError(
    async (req, res, next) => {

        // get email from request
        const { email } = req.body;

        // if email is missing
        if (!email) {
            return next(new ErrorHandler("Please Enter Email!", 400));
        }

        // check if user with this email exists
        const user = await userSchema.findOne({ email });

        // if user not found
        if (!user) {
            return next(new ErrorHandler("User Not Found!", 404));
        }

        // generate reset token and save to user model
        const resetToken = await user.generateForgetPasswordLink();

        // save user but skip validation
        await user.save({ validateBeforeSave: false });

        // create full reset link
        const resetURL = `${process.env.RESET_PASSWORD_URL}${resetToken}`;

        // create email message
        const message = `You are receiving this email because you (or someone else) have requested a password reset for your account.\n\nPlease click on the following link to complete the process:\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

        try {
            // send email to user
            await mailSender({ email: user.email, subject: "Chatapp Password Recovery", message });

            // show success response
            res.status(200).json({ success: true, message: "Reset Password Link Sent Successfully!" });

        } catch (error) {
            // if email fails, remove reset token fields and save again
            user.resetPasswordToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save({ validateBeforeSave: false });

            // show error response
            next(new ErrorHandler("Failed to send Reset Password Link!", 500));
        }

    }
)


// user Reset Password through Sent Mail
export const userResetPassword = catchAsyncError(
    async (req, res, next) => {

        // get new passwords from user
        const { password, confirmPassword } = req.body;

        // check if both fields are filled
        if (!password || !confirmPassword) {
            return next(new ErrorHandler("Please Enter Complete Details!", 400));
        }

        // check if both passwords match
        if (password !== confirmPassword) {
            return next(new ErrorHandler("Passwords do not match!", 400));
        }

        // create hashed token to match saved one in database
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // find user with this reset token and check expiry time
        const user = await userSchema.findOne({ resetPasswordToken, resetTokenExpiration: { $gt: Date.now() } });

        // if token is wrong or expired
        if (!user) {
            return next(new ErrorHandler("Invalid or Expired Token!", 400));
        }

        // save new password to user
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetTokenExpiration = undefined;

        // save changes in database
        await user.save({ validateBeforeSave: false });

        // show success response
        res.status(200).json({ success: true, message: "Password Reset Successfully!" });
    }
)


// User Logout
export const userLogout = catchAsyncError(
    async (req, res, next) => {

        // check if token exists in cookie
        if (!req.cookies.token) {
            return next(new ErrorHandler("no Token Found! Please Login.", 404));
        }

        // remove the token cookie from browser
        res.clearCookie("token", {
            httpOnly: true, // secure: only accessible by backend
            secure: true,   // cookie sent only in https
            sameSite: "None", // allow cross-site request
        });

        // show logout success message
        res.status(200).json({ success: true, message: "User Logout Successfully! " })
    }
)

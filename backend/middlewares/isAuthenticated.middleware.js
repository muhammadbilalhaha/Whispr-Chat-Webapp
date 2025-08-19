import userSchema from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandlerClass.js";
import catchAsyncError from "./catchAsyncError.middleware.js";
import jsonwebtoken from "jsonwebtoken";


// Middleware to check if user is authenticated (logged in)
export const isAuthenticated = catchAsyncError(

    // This async function will run before accessing protected routes
    async (req, res, next) => {

        // Get the token from cookies
        const token = req.cookies.token;

        // If token is missing, user is not logged in
        if (!token) {
            // Send error response
            return next(new ErrorHandler("Not authorized! token is not Found.", 401));
        }

        // Verify the token using secret key
        const verifiedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // If token is invalid (expired or tampered)
        if (!verifiedToken) {
            return next(new ErrorHandler("Not authorized! token is invalid.", 401));
        }

        // Get the user from database using the ID inside the token
        const user = await userSchema.findById(verifiedToken.id);

        // If user is not found in database
        if (!user) {
            return next(new ErrorHandler("User no longer exists!", 404));
        }

        // Attach user object to the request (so we can use it in next middlewares/controllers)
        req.user = user;

        // Move to the next function (controller or next middleware)
        next();

    }

);

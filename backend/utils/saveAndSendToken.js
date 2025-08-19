import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";

const saveAndSendToken = catchAsyncError(
    async(user, statusCode, res)=>{

        const token = user.generateToken();

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        }

        res.status(statusCode).cookie("token", token, options).json({success: true, user, token});

    }
) 

    export default saveAndSendToken;
import mongoose from "mongoose";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";

const connectMongoDB = catchAsyncError(
    async ()=>{
        mongoose.connect(process.env.DB_URI).then(console.log("Database is Connected Successfully"));
    }
)

export default connectMongoDB;
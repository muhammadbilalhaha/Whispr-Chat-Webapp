import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userModel = new Schema({

    userName: {
        type: String,
        required: [true, "Please Enter User Name!"]
    },

    password: {
        type: String,
        select: false
    },

    email: {
        type: String,
        required: [true, "Please Enter Email!"],
        unique: [true, "This is Already Taken!"],
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please Enter a Valid Email!"
        }
    },

    profilePicture: {
        type: String,
        default: ""
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    role: {
        type: String,
        default: "user"
    },
    
    isBlocked: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: String,
    resetTokenExpiration: Date,

})


// Generater JWT Token For New Account
userModel.methods.generateToken = function () {
    const token = jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
    return token;
}

// Password Hashing Before Save
userModel.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Password Matching During Login
userModel.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate Forget Link Token
userModel.methods.generateForgetPasswordLink = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpiration = Date.now() + process.env.RESET_PASSWORD_EXPIRE * 60 * 1000;
    return resetToken;
}


const userSchema = mongoose.model("User", userModel);

export default userSchema;
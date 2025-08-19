// importing required files and models
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js"; // async error handler
import ErrorHandler from "../utils/errorHandlerClass.js"; // custom error handler
import userSchema from "../models/user.model.js"; // user model
import cloudinary from "../config/cloudinary.js"; // for image uploads
import messageSchema from "../models/message.model.js"; // message model


// Load logged-in user info (used for auto-login or checking user)
export const userLoader = catchAsyncError((req, res, next) => {

    // if user is not found (not logged in)
    if (!req.user && !req.user.id) {
        return next(new ErrorHandler("User is not Found! Please Login.", 404));
    }

    // return user info
    res.status(200).json(req.user);
});


// Update user profile (only name, email, picture — not password)
export const userProfileUpdate = catchAsyncError(async (req, res, next) => {
    const { userName, email, profilePicture } = req.body;

    // check if name and email are filled
    if (!userName?.trim() || !email?.trim()) {
        return next(new ErrorHandler("UserName and Email cannot be empty!", 400));
    }

    const updateFields = {
        userName: userName.trim(),
        email: email.trim(),
    };

    // if profile picture is provided, upload to cloudinary
    if (profilePicture?.trim()) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
                folder: "chat-app/users",
                public_id: `user_${req.user.id}`,
                overwrite: true,
                transformation: [{ width: 300, height: 300, crop: "fill" }],
            });

            updateFields.profilePicture = uploadResponse.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error.message);
            return next(new ErrorHandler("Image upload failed!", 500));
        }
    }

    // update user in database
    const user = await userSchema.findByIdAndUpdate(req.user.id, updateFields, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    res.status(200).json({
        success: true,
        message: "User profile updated successfully!",
        user,
    });
});


// Change password for logged-in user
export const userChangePassword = catchAsyncError(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    // check if both fields are filled
    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Input fields cannot be empty!", 400));
    }

    // check if passwords match
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match!", 400));
    }

    const user = await userSchema.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found!", 401));
    }

    // update password
    user.password = password;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully!",
    });
});


// Get all friends of the logged-in user
export const GetAllFriends = catchAsyncError(async (req, res, next) => {
    const user = await userSchema
        .findById(req.user.id)
        .populate("friends", "userName email profilePicture"); // load friend's basic info

    if (!user) {
        return next(new ErrorHandler("User is not Found!", 404));
    }

    // get last message for each friend
    const friendsWithLastMessage = await Promise.all(
        user.friends.map(async (friend) => {
            const lastMessageDoc = await messageSchema.findOne({
                $or: [
                    { senderId: req.user.id, receiverId: friend._id },
                    { senderId: friend._id, receiverId: req.user.id }
                ],
                deletedBy: { $nin: [req.user.id] } // ← filters out messages deleted by the user
            }).sort({ createdAt: -1 });

            return {
                _id: friend._id,
                userName: friend.userName,
                email: friend.email,
                profilePicture: friend.profilePicture,
                lastMessage: lastMessageDoc?.text || (lastMessageDoc?.image ? "Image" : ""),
                lastMessageTime: lastMessageDoc?.createdAt || null,
                lastMessageId: lastMessageDoc?._id || null,
                lastMessageSenderId: lastMessageDoc?.senderId?.toString() || null // convert ObjectId to string
            };
        })
    );

    res.status(200).json({
        success: true,
        message: "All Friends are Fetched Successfully!",
        friends: friendsWithLastMessage
    });
});



// Search for a new friend by email (excluding current user and already added friends)
export const searchNewFriend = catchAsyncError(async (req, res, next) => {
    const { email } = req.query;
    const userId = req.user.id;

    if (!email) {
        return res.status(400).json({ message: "Email must be required" });
    }

    const users = await userSchema.find({
        email: { $regex: email, $options: 'i' }, // match email, case insensitive
        _id: { $ne: userId }, // exclude current user
        friends: { $ne: userId } // exclude already friends
    }).select('userName email profilePicture');

    res.status(200).json(users);
});


import { getReceiverSocketId, io } from "../config/socket.js"; // make sure path is correct

// Add a friend by their email
export const userAddFriend = catchAsyncError(async (req, res, next) => {
    const email = req.body.email.toLowerCase().trim();

    if (!email) {
        return next(new ErrorHandler("Email is not Found. Please try again", 404));
    }

    // prevent adding yourself
    if (email === req.user.email) {
        return next(new ErrorHandler("You cannot add yourself as a friend!", 400));
    }

    const friend = await userSchema.findOne({ email });

    if (!friend) {
        return next(new ErrorHandler("Friend is not Found. Please try again", 404));
    }

    const user = await userSchema.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User is not Found!", 404));
    }

    // check if already friends
    if (user.friends.includes(friend.id)) {
        return next(new ErrorHandler("Friend already added!", 400));
    }

    // add each other as friends
    await userSchema.findByIdAndUpdate(user.id, { $push: { friends: friend.id } }, { new: true });
    await userSchema.findByIdAndUpdate(friend.id, { $push: { friends: user.id } }, { new: true });

    // --------------------------
    // Emit "friend-added" event to the friend (if online)
    // --------------------------
    const receiverSocketId = getReceiverSocketId(friend._id.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("friend-added", {
            _id: user._id,
            userName: user.userName,
            profilePicture: user.profilePicture,
            lastMessage: null,
            lastMessageTime: null
        });
    }

    res.status(200).json({
        success: true,
        message: "Friend is Added Successfully!",
        friend: {
            _id: friend._id,
            userName: friend.userName,
            profilePicture: friend.profilePicture
        }
    });
});



// Delete a friend (remove from both users' friend lists + delete messages)
export const userDeleteFriend = catchAsyncError(async (req, res, next) => {
    const friendId = req.params.friendId;

    if (!friendId) {
        return next(new ErrorHandler("Friend ID is not provided. Please try again", 400));
    }

    const user = await userSchema.findById(req.user.id);
    const friend = await userSchema.findById(friendId);

    if (!user) {
        return next(new ErrorHandler("User is not Found!", 404));
    }

    // If friend doesn't exist, still remove from user's list
    if (!friend) {
        await userSchema.findByIdAndUpdate(user.id, { $pull: { friends: friendId } }, { new: true });
        return next(new ErrorHandler("Friend is Deleted from your list. But Friend is not Found in database!", 404));
    }

    // Check if friend exists in your list
    if (!user.friends.includes(friendId)) {
        return next(new ErrorHandler("Friend is not found in your friends list!", 404));
    }

    // Remove each other as friends
    await userSchema.findByIdAndUpdate(user.id, { $pull: { friends: friendId } }, { new: true });
    await userSchema.findByIdAndUpdate(friendId, { $pull: { friends: user.id } }, { new: true });

    // Delete all messages between the two users
    await messageSchema.deleteMany({
        $or: [
            { senderId: user.id, receiverId: friendId },
            { senderId: friendId, receiverId: user.id }
        ]
    });

    // Notify friend in real-time (if online)
    const receiverSocketId = getReceiverSocketId(friendId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("friend-deleted", {
            userId: user._id, // who deleted you
        });
    }

    res.status(200).json({ success: true, message: "Friend and all conversations deleted successfully!" });
});
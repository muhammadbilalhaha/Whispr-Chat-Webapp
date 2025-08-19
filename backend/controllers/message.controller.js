import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import userSchema from '../models/user.model.js';
import messageSchema from '../models/message.model.js';
import ErrorHandler from '../utils/errorHandlerClass.js';
import cloudinary from '../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import { getReceiverSocketId, io } from '../config/socket.js';
import mongoose from 'mongoose';


// =============================
// Controller: Send Message (Text or Image)
// =============================
export const sendingMessage = catchAsyncError(
    async (req, res, next) => {
        // Getting friend's ID from URL parameter
        const { friendId } = req.params;

        // If friend ID is missing in request
        if (!friendId) {
            // Send error message
            return next(new ErrorHandler("Friend ID is not provided. Please try again", 400));
        }

        // Get the current user from the database using ID in JWT
        const user = await userSchema.findById(req.user.id);

        // If the friend is not in user's friend list
        if (!user.friends.includes(friendId)) {
            // Send error saying they are not friends
            return next(new ErrorHandler("You are not friends with this user!", 403));
        }

        // Create a variable to store image URL (if any)
        let imageURL = "";

        // Check if the image is included in request body
        if (req.body.image?.trim()) {
            try {
                // Create a unique public ID using user ID and random ID
                const uniqueId = `user_${req.user.id}_${uuidv4()}`;

                // Upload image to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
                    folder: "chat-app/sending-receiving-images", // Folder name in Cloudinary
                    public_id: uniqueId, // Unique name to prevent overwrite
                });

                // Save the image URL returned by Cloudinary
                imageURL = uploadResponse.secure_url;

            } catch (error) {
                // Print error if image upload fails
                console.error("Cloudinary upload error:", error.message);
                console.error(error);

                // Send error to client
                return next(new ErrorHandler("Image upload failed!", 500));
            }
        }

        // Create a new message document
        const newMessage = new messageSchema({
            senderId: req.user.id,        // Who sent the message
            receiverId: friendId,         // Who will receive the message
            text: req.body.text,          // Message text
            image: imageURL,              // Image URL if any
            status: "sent",
        });

        // Save the message in database
        await newMessage.save();

        // Get the receiver's socket ID if they are online
        const receiverSocketId = getReceiverSocketId(friendId);

        // If receiver is connected (online)
        if (receiverSocketId) {
            // Send real-time message using socket.io
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Send success response with saved message
        res.status(201).json(newMessage);
    }
);


// =============================
// Controller: Get Messages with One Friend
// =============================
export const getSingleFriendMessage = catchAsyncError(
    async (req, res, next) => {
        // Getting friend ID from URL
        const { friendId } = req.params;

        // If friend ID is not provided
        if (!friendId) {
            // Send error message
            return next(new ErrorHandler("Friend ID is not provided. Please try again", 400));
        }

        // Get the current user from the database
        const user = await userSchema.findById(req.user.id);

        // If the friend is not in user's friend list
        if (!user.friends.includes(friendId)) {
            // Send error message
            return next(new ErrorHandler("You are not friends with this user!", 403));
        }

        // Check if friend exists in database
        const friend = await userSchema.findById(friendId);

        // If friend not found in database
        if (!friend) {
            // Send error message
            return next(new ErrorHandler("Friend is not found. Please try again", 404));
        }

        // Get all messages between user and this friend
        const messages = await messageSchema.find({
            $or: [
                { senderId: req.user.id, receiverId: friendId },
                { senderId: friendId, receiverId: req.user.id }
            ],
            deletedBy: { $nin: [req.user.id] } // ← filters out messages deleted by the user
        }).sort({ createdAt: 1 });

        // If no messages were found
        if (messages.length === 0) {
            // Send error
            return next(new ErrorHandler("No messages found. Please try again", 404));
        }

        // Send all messages to frontend
        res.status(200).json({
            success: true,
            message: "Messages Found Successfully!",
            messages  // List of all messages
        });
    }
);

// =============================
// Controller: Deleting Message (Text or Image)
// =============================
export const deletingMessage = catchAsyncError(
    async (req, res, next) => {
        const { userId } = req.body;
        const { messageId } = req.params;
        const { deleteFor } = req.query;

        console.log("user id", userId)
        console.log("Message id", messageId)
        console.log("delete for", deleteFor)

        const message = await messageSchema.findById(messageId);
        if (!message) {
            return next(new ErrorHandler("No Message Found!", 404));
        }

        if (deleteFor === "me") {
            if (!message.deletedBy.includes(userId)) {
                message.deletedBy.push(userId);
                await message.save();
            }
            return res.status(200).json({ success: true, message: "Message Deleted for me!" })
        }

        if (deleteFor === "everyone") {
            if (message.senderId.toString() !== userId) {
                return res.status(403).json({ error: "Only Sender can Delete for everyone!" });
            }
        }

        await messageSchema.findByIdAndDelete(messageId);
        return res.status(200).json({ message: "Message deleted for everyone" });

    }
)

// =============================
// Controller: Forwarding Message
// =============================
export const forwardingMessage = catchAsyncError(
    async (req, res, next) => {
        const { messageId, friendIds } = req.body;
        const userId = req.user.id;

        if (!messageId || !Array.isArray(friendIds) || friendIds.length === 0) {
            return next(new ErrorHandler("Invalid data Request!", 400));
        }
        // Find the Original Message id
        const originalMessage = await messageSchema.findById(messageId);
        if (!originalMessage) {
            return next(new ErrorHandler("Original Message not Found!", 404));
        }

        // Loop for each Friend id to append new message
        const forwardedMessage = []
        for (const friendId of friendIds) {
            const newMessage = await messageSchema.create({
                senderId: userId,
                receiverId: friendId,
                text: originalMessage.text || '',
                image: originalMessage.image || null,
                isForwarded: true,
                originalMessageId: originalMessage._id
            });

            forwardedMessage.push(newMessage);

            // Send to receiver in real-time if online
            const receiverSocketId = getReceiverSocketId(friendId.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            // Also send to sender's own chat window so they instantly see the forwarded message
            const senderSocketId = getReceiverSocketId(userId.toString());
            if (senderSocketId) {
                io.to(senderSocketId).emit("newMessage", newMessage);
            }
        }

        res.status(200).json({ success: true, forwardedMessage })
    }
)

// get unread counts for the logged-in user
export const getUnreadMessageCountForUser = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;

    // Group unread messages by sender for this user (receiver)
    const unreadCounts = await messageSchema.aggregate([
        {
            $match: {
                receiverId: new mongoose.Types.ObjectId(userId),
                status: { $in: ["sent", "delivered"] }
            }
        },
        {
            $group: {
                _id: "$senderId",
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({ success: true, unreadCounts });
});


// mark messages as read between current user and a friend
export const markMessagesAsRead = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const { friendId } = req.params;

    if (!friendId) {
        return next(new ErrorHandler("Friend ID is required", 400));
    }

    // Update all messages sent by friendId to userId where isRead is false
    await messageSchema.updateMany(
        {
            senderId: friendId,
            receiverId: userId,
            isRead: false,
        },
        { $set: { isRead: true, status: "read" } }
    );

    // Optionally emit socket event to sender to update UI immediately
    const senderSocketId = getReceiverSocketId(friendId);
    if (senderSocketId) {
        io.to(senderSocketId).emit("messages-read-by-receiver", { readerId: userId });
    }

    res.status(200).json({ success: true, message: "Messages marked as read" });
});



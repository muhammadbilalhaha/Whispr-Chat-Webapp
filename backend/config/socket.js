// Import required packages
import { Server } from 'socket.io'; // To make real-time chat or live updates
import http from 'http'; // To create a basic web server
import express from 'express'; // To help build web applications easily
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js';
import messageSchema from '../models/message.model.js';

// Create an express app
const app = express();

// Create a web server using the express app
const server = http.createServer(app);

// Create a socket.io server and allow it to connect with frontend (React app on port 5173)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Only allow this address to connect
    }
});

// This object will store which user is connected to which socket
// Example: { userId1: socketId1, userId2: socketId2 }
const userSocketMap = {};

// This function gives the socket id of the user we want to send message to
export function getReceiverSocketId(receiverId) {
    return userSocketMap[receiverId]; // Return the socket id of that user
}

// Run this when a new user connects
io.on("connection", (socket) => {
    console.log("User Connected: ", socket.id); // Show the new user's socket id in console

    // Get the userId from the connection (sent from frontend)
    const userId = socket?.handshake?.query?.userId;

    // If userId is valid and not missing
    if (userId && userId !== "undefined") {
        // Save the user's socket id in the map
        userSocketMap[userId] = socket.id;
        // Tell all users who is online now
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Handle When Message Delivered
    socket.on("message-delivered", catchAsyncError(
        async ({ messageId }) => {

            const updated = await messageSchema.findByIdAndUpdate(messageId, { status: "delivered" }, { new: true });
            if (updated) {
                const senderSocketId = userSocketMap[updated.senderId.toString()];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("message-status-updated", { messageId: updated._id, status: 'delivered' })
                }
            }

        }
    ))

    // Handle When Message is Read
    socket.on("message-read", catchAsyncError(
        async ({ messageId }) => {
            const updated = await messageSchema.findByIdAndUpdate(
                messageId,
                { status: "read", isRead: true },
                { new: true }
            );

            if (updated) {
                const senderSocketId = userSocketMap[updated.senderId.toString()];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("message-status-updated", {
                        messageId: updated._id,
                        status: "read"
                    });
                }
            }
        }
    ));



    // Run this when a user disconnects (closes tab or internet disconnects)
    socket.on("disconnect", () => {
        console.log("User Disconnected: ", socket.id); // Show in console

        // Remove the user's socket id from the map if it's valid
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId]; // Remove the user from online list

            // Tell all users the updated online users
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// Export the express app, the server, and the socket server to use in other files
export { app, server, io };

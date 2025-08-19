import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import userSchema from "../models/user.model.js";
import messageSchema from "../models/message.model.js";
import ErrorHandler from "../utils/errorHandlerClass.js";

// Getting All Users Account --> Master--Admin
export const gettingAllUsersAccounts = catchAsyncError(
    async (req, res, next) => {
        const users = await userSchema
            .find({}, 'userName email role createdAt isBlocked friends')
            .populate('friends', 'userName');

        if (!users || users.length === 0) {
            return next(new ErrorHandler("No user accounts found.", 404));
        }

        const messageStats = await messageSchema.aggregate([
            {
                $group: {
                    _id: "$senderId",
                    totalMessages: { $sum: 1 },
                    lastMessageTime: { $max: "$createdAt" }
                }
            }
        ]);

        const statsMap = new Map();
        messageStats.forEach(stat => {
            if (stat._id) {
                statsMap.set(stat._id.toString(), {
                    totalMessages: stat.totalMessages,
                    lastMessageTime: stat.lastMessageTime
                });
            }
        });

        const usersWithStats = users.map(user => {
            const stats = statsMap.get(user._id.toString()) || {};
            return {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                isBlocked: user.isBlocked,
                totalMessages: stats.totalMessages || 0,
                lastMessageTime: stats.lastMessageTime || null,
                friends: user.friends.map(f => f.userName)
            };
        });

        res.status(200).json({
            success: true,
            message: "User accounts with message stats retrieved successfully.",
            data: usersWithStats
        });
    }
);

//dashboard analytics like: Total users -- Total messages -- Total sessions  -- Conversion rate
export const getAdminAnalytics = catchAsyncError(async (req, res, next) => {
    // 1. Total Users
    const totalUsers = await userSchema.countDocuments();

    // 2. Total Messages
    const totalMessages = await messageSchema.countDocuments();

    // 3. Active Users (based on last login, message sent, or `isBlocked: false`)
    const activeUsers = await userSchema.countDocuments({ isBlocked: false });

    // 4. Conversion Rate (active / total * 100)
    const conversionRate = totalUsers > 0
        ? ((activeUsers / totalUsers) * 100).toFixed(2)
        : 0;

    res.status(200).json({
        success: true,
        message: "Admin dashboard analytics fetched successfully.",
        data: {
            totalUsers,
            totalMessages,
            activeUsers,
            conversionRate: `${conversionRate}%`
        }
    });
});

// Changing Role of User by ---> Master--Admin
export const userRoleChange = catchAsyncError(
    async (req, res, next) => {

        const { newRole } = req.body;
        const { targetedUserId } = req.params;


        if (!targetedUserId || !newRole) {
            return next(new ErrorHandler("Targeted User Id and new Role are Required!", 404));
        }

        const targetUser = await userSchema.findById(targetedUserId);

        if (!targetUser) {
            return next(new ErrorHandler("Targeted User is not Found!", 404));
        }

        if (!req.user.role === 'master') {
            if (targetUser.role === 'master' || targetUser.role === "admin") {
                return next(new ErrorHandler("You ave no Access to change this role!", 403));
            }
        }

        if (targetUser.role === 'master') {
            return next(new ErrorHandler("You ave no Access to change this role!", 403));
        }

        targetUser.role = newRole;

        await targetUser.save();

        res.status(200).json({
            success: true,
            message: `User role updated to '${newRole}' successfully.`,
            updatedUser: {
                userName: targetUser.userName,
                email: targetUser.email,
                role: targetUser.role,
                updatedAt: targetUser.updatedAt
            }
        });


    }
)


// Deleting User Account by Just Master
export const userAccountDelete = catchAsyncError(
    async (req, res, next) => {
        const { targetedUserId } = req.params;

        if (!targetedUserId) {
            return next(new ErrorHandler("Target User Id is Must Required!", 403));
        }

        const targetUser = await userSchema.findById(targetedUserId);

        if (!targetUser) {
            return next(new ErrorHandler("Targeted User is not Found!", 404));
        }

        // Prevent deletion of other master accounts
        if (targetUser.role === 'master') {
            return next(new ErrorHandler("Cannot delete a master account.", 403));
        }

        await targetUser.deleteOne();

        res.status(200).json({
            success: true,
            message: `User Account [${targetUser.userName}] is Deleted Successfully!`
        })

    }
)

// Block and Unblocking the user Account by Master || Admin
export const userAccountBlock = catchAsyncError(
    async (req, res, next) => {
        const { targetedUserId } = req.params;

        if (req.user.role !== 'admin' && req.user.role !== 'master') {
            return next(new ErrorHandler("Only admin or master can block/unblock users.", 403));
        }

        const targetUser = await userSchema.findById(targetedUserId);

        if (!targetUser) {
            return next(new ErrorHandler("Targeted user not found.", 404));
        }

        // Master trying to block another master (not allowed)
        if (req.user.role === 'master' && targetUser.role === 'master') {
            return next(new ErrorHandler("Master cannot block another master.", 403));
        }

        // Admin can only block/unblock users (not admin or master)
        if (req.user.role === 'admin' && targetUser.role !== 'user') {
            return next(new ErrorHandler("Admin can only block/unblock regular users.", 403));
        }

        // Toggle block state
        targetUser.isBlocked = !targetUser.isBlocked;
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: `User '${targetUser.userName}' has been ${targetUser.isBlocked ? 'blocked' : 'unblocked'} successfully.`
        });
    }
)


// Delete Message - Admin & Master
export const deleteMessage = catchAsyncError(async (req, res, next) => {
    const { messageId } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'master') {
        return next(new ErrorHandler("Only admin or master can delete messages.", 403));
    }

    const message = await messageSchema.findById(messageId);
    if (!message) {
        return next(new ErrorHandler("Message not found.", 404));
    }

    await message.deleteOne();

    res.status(200).json({
        success: true,
        message: "Message deleted successfully."
    });
});
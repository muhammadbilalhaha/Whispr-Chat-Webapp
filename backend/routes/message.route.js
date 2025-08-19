import { Router } from "express";
import { deletingMessage, forwardingMessage, getSingleFriendMessage, getUnreadMessageCountForUser, markMessagesAsRead, sendingMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router = Router()

router.route("/sendingMessage/:friendId").post(isAuthenticated, sendingMessage);
router.route("/getSingleFriendMessage/:friendId").get(isAuthenticated, getSingleFriendMessage);
router.route("/forwardingMessage").post(isAuthenticated, forwardingMessage);
router.route("/unreadMessageCount").get(isAuthenticated, getUnreadMessageCountForUser);
router.route("/markAsRead/:friendId").post(isAuthenticated, markMessagesAsRead);
router.route("/messageDelete/:messageId").delete(isAuthenticated, deletingMessage);

export default router;
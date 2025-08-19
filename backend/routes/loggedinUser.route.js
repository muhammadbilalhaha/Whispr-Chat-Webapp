import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { GetAllFriends, searchNewFriend, userAddFriend, userChangePassword, userDeleteFriend, userLoader, userProfileUpdate } from "../controllers/loggedinUser.controller.js";


const router = Router();

router.route("/userLoader").get(isAuthenticated, userLoader);
router.route("/userUpdateProfile").put(isAuthenticated, userProfileUpdate);
router.route("/userChangePassword").put(isAuthenticated, userChangePassword);
router.route("/userGetAllFriends").get(isAuthenticated, GetAllFriends);
router.route("/searchNewFriend").get(isAuthenticated, searchNewFriend);
router.route("/userAddNewFriend").post(isAuthenticated, userAddFriend);
router.route("/userDeleteFriend/:friendId").delete(isAuthenticated, userDeleteFriend);

export default router;
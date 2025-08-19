import { Router } from "express";
import { deleteMessage, getAdminAnalytics, gettingAllUsersAccounts, userAccountBlock, userAccountDelete, userRoleChange } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { authorizeAdminOrMaster, authorizeMaster } from "../middlewares/authorizeAdminOrMaster.js";

const router = Router();

router.route("/gettingAllUserAccounts").get(isAuthenticated, authorizeAdminOrMaster, gettingAllUsersAccounts);
router.route("/changeUserRole/:targetedUserId").put(isAuthenticated, authorizeAdminOrMaster, userRoleChange);
router.route("/gettingTotalUsersAnalytics").get(isAuthenticated, authorizeAdminOrMaster, getAdminAnalytics);
router.route("/deleteUserAccount/:targetedUserId").delete(isAuthenticated, authorizeMaster, userAccountDelete);
router.route('/userAccountBlock/:targetedUserId').put(isAuthenticated, authorizeAdminOrMaster, userAccountBlock)
router.delete('/userMessageDelete/:messageId', isAuthenticated, authorizeAdminOrMaster, deleteMessage);


export default router;
import ErrorHandler from "../utils/errorHandlerClass.js";

// Checkpoint for Checking the Role is Master || Admin
export const authorizeAdminOrMaster = (req, res, next) => {
    const user = req.user; // Assuming user is already attached by authentication middleware

    if (!user || (user.role !== 'admin' && user.role !== 'master')) {
        return next(new ErrorHandler("Access denied: Only master or admin can perform this action.", 403));
    }

    next(); // User is authorized
};


// Checkpoint for Checking the Role is Just Master
export const authorizeMaster = (req, res, next) => {
    const user = req.user; // Assuming user is already attached by authentication middleware

    if (!user || user.role !== 'master') {
        return next(new ErrorHandler("Access denied: Only master can perform this action.", 403));
    }

    next(); // User is authorized
};


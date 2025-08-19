import ErrorHandler from "../utils/errorHandlerClass.js";


const errorHandler = (err, req, res, next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error!';

    // Handle the cast Error 
    if(err.name === "CastError"){
        const message = "Resource Not Found! " + err.path;
        err = new ErrorHandler(message, 400);
    }

    // Handling the Duplication Error
    if(err.code === 11000){
        const message = `Duplicate field value: ${Object.keys(err.keyValue)[0]}`;
        err = new ErrorHandler(message, 400);
    }

    // Handling Wrong JWT Error
    if(err.name === "jsonWebTokenError"){
        const message = "Invalid/Expired JWT Token!";
        err = new ErrorHandler(message, 401);
    }

    // Handling JWT Expired Error
    if(err.name === "TokenExpiredError"){
        const message = "JWT Token Expired!";
        err = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({success: false, message: err.message});

}

export default errorHandler;
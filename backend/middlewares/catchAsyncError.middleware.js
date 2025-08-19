const catchAsyncError = (ftn)=>{
    return (req, res, next)=>{
        Promise.resolve(ftn(req, res, next)).catch(next);
    };
};

export default catchAsyncError;
const asyncHandler = (requestHandler) => {
    (res,req,error) =>{
        Promise.resolve(requestHandler(req,res,error)).catch((error) => next(error))
    }
}

export {asyncHandler};
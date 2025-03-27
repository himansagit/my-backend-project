import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler( async (req,res) => {
    const {fullName, username, email, password} = req.body

    if(fullName === ""){
        throw new ApiError(400, "Full Name is require")
    }else if(username === ""){
        throw new ApiError(400, "Username is require")
    }
    else if(email === ""){
        throw new ApiError(400, "Email is require")
    }else if(password === ""){
        throw new ApiError(400, "Password is require")
    }

    const existedUser = await User.findOne({
        $or: [ {username} , { email } ]
    })

    if( existedUser ){
        throw new ApiError(409,"User with same username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const converImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
    {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email: email,
        password: password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if( !createdUser){
        throw new ApiError(500, "Somethign went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created succesfully")
    );



})

export {registerUser}

/*
    extract user data form frontend
    validation - not empty
    check if user already exist: username and email
    check for username and avatar
    upload them to cloudinary
    create new user object -> create entyr in db
    remove passoword and refresh token field
    chcek for user creattion
    return response
    
*/

// Comment block to test weather email is added for commits
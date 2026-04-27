import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found while generating tokens");
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefereshToken()

        // save to DB 
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went while genrating access and refersh tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {fullname, email, username, password} = req.body;

    console.log("BODY:", req.body);

    if(!fullname?.trim()) throw new ApiError(400, "fullname is required")
    if(!email?.trim()) throw new ApiError(400, "email is required")
    if(!username?.trim()) throw new ApiError(400, "username is required")
    if(!password?.trim()) throw new ApiError(400, "password is required")

    const existdUser = await User.findOne({
        $or: [{username}, {email}]
    })


    if(existdUser) throw new ApiError(409, "User with same email or username already exist")

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if(!avatarLocalPath) throw new ApiError(400, "avatar image is required")

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar) throw new ApiError(400, "avatar image is required")

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500, "something went wrong while registring new user!")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully !!")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    console.log("BODY:", req.body);
console.log("QUERY:", req.query);
    // get email and password
    const {email, password } = req.body;

    // validate inputs
    if(!email?.trim()) throw new ApiError(400, "email not found");
    if(!password?.trim()) throw new ApiError(400, "password not found");
    
    // 4. If user not found → invalid credentials
    // find user
    const user = await User.findOne({ email });
    if(!user) throw new ApiError(400, "user does not exist")

    // compare password using model
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(400, "invalid credendials")

    // generate access and refresh token
    const{accessToken, refreshToken} = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // send respoone to user => cookie/json
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    );
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        { $set: {refreshToken: null }},
        { new: true }
    )
    
        const options = {
            httpOnly: true,
            secure: true
        };
    
        return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "Logged Out Successfully !!"))
})

const refereshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefereshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefereshToken) throw new ApiError(401, "unauthorized request") 

    try {
        const decodedToken = jwt.verify(
            incomingRefereshToken,
            process.env.REFERSH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user) throw new ApiError(401, "invalid referesh token")
    
        if(incomingRefereshToken !== user.refreshToken) throw new ApiError(401, "Referesh Token is exoired or used")
    
        const {accessToken, refreshToken} = await generateTokens(user._id)
        
        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { accessToken, refreshToken },
                "Access Token Refreshed"
            )
        )

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid referesh token")
    }

})

export {registerUser, loginUser, logoutUser, refereshAccessToken}
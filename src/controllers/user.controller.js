import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    const {fullname, email, username, password} = req.body;

    console.log("BODY:", req.body);

    if(!fullname?.trim()) throw new ApiError(400, "fullname is required")
    if(!email?.trim()) throw new ApiError(400, "email is required")
    if(!username?.trim()) throw new ApiError(400, "username is required")
    if(!password?.trim()) throw new ApiError(400, "password is required")

    console.log("fullname:", fullname);
    console.log("email:", email);
    console.log("username:", username);

    const existdUser = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log("Existing user:", existdUser);

    if(existdUser) throw new ApiError(409, "User with same email or username already exist")

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log("Avatar path:", avatarLocalPath);
    if(!avatarLocalPath) throw new ApiError(400, "avatar image is required")

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log("Cover Image path:", coverImageLocalPath);


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

export {registerUser}
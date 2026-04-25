import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const videoUpload = asyncHandler(async (req, res) => {
    const {title, description} = req.body; // I think it will be from req.files videoFile, thumbnail, 

    console.log("Video object BODY:", req.body);

    if(!title?.trim()) throw new ApiError(400, "title is required")
    if(!description?.trim()) throw new ApiError(400, "description is required")

    // const owner = await User.findOne({
    //     $or: [{username}, {email}]
    // })
    
    // console.log("Owner of the video :", owner);

    // if(!owner) throw new ApiError(409, "User not found")

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if(!videoLocalPath) throw new ApiError(400, "video image is required")

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if(!thumbnailLocalPath) throw new ApiError(400, "thumbnail image is required")
    
    const video = await uploadOnCloudinary(videoLocalPath)
    if(!video) throw new ApiError(400, "video image is required")

    const videoDuration = video.duration;

    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail) throw new ApiError(400, "thumbnail image is required")
    
    const videoUploaded = await Video.create({
        title,
        description,
        duration: videoDuration,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        views: 0,
        isPublished: true,
        owner: "69ec6e4a2602d9f66663b433"
    })

    return res.status(201).json(
        new ApiResponse(200, video, "Video Uploaded Successfully !!")
    )

})

export default videoUpload;
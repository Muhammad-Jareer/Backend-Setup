import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const videoUpload = asyncHandler(async (req, res) => {
    console.log("");
    
    const { title, description } = req.body;

    if (!title?.trim()) throw new ApiError(400, "title is required");
    if (!description?.trim()) throw new ApiError(400, "description is required");

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) throw new ApiError(400, "video file is required");

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) throw new ApiError(400, "thumbnail is required");

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || !thumbnail) {
        throw new ApiError(400, "upload failed");
    }

    const videoUploaded = await Video.create({
        title,
        description,
        duration: video.duration,
        videoFile: video.secure_url,
        thumbnail: thumbnail.secure_url,
        views: 0,
        isPublished: true,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(200, videoUploaded, "Video uploaded successfully")
    );
});

export default videoUpload;
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const videoUpload = asyncHandler(async (req, res) => {
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


const getVideoOwnerDetails = asyncHandler(async(req, res) => {
    const{videoId} = req.params;
    if(!videoId || !(videoId.trim())) throw new ApiError(400, "video id is incorrect")

    const objectId = new mongoose.Types.ObjectId(videoId);

    const videoOwnerDetails = await Video.aggregate([
        {
            $match: {
                _id: objectId
            }
        },
        {
            $lookup: {
                from: "users", 
                foreignField: "_id",
                localField: "owner",
                as: "user"
            }
        }, 
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "channel",
                localField: "owner",
                as: "subscribers"
            }
        }, 
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "subscriber",
                localField: "owner",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                },
            }
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ])

    res
    .status(200)
    .json(new ApiResponse(200, videoOwnerDetails[0], "Video owner data feteched successfully"))
})

const watchVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId || !videoId.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const userId = req.user._id;

    // 1️⃣ Add to watch history
    await User.findByIdAndUpdate(
        userId,
        {
            $addToSet: {
                watchHistory: videoObjectId
            }
        }
    );

    // 2️⃣ Increase views
    await Video.findByIdAndUpdate(
        videoObjectId,
        {
            $inc: { views: 1 }
        }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "Video watched successfully")
    );
});


export {videoUpload, getVideoOwnerDetails, watchVideo};
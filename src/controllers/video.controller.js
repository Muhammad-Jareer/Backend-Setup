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

const getVideoCreatorDetails = asyncHandler(async(req, res) => {
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
            $lookup: {
                from: "likes",
                foreignField: "video",
                localField: "owner",
                as: "likes"
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
                likesCount: {
                    $size: "$likes"
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
                isLiked: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$likes.owner"]
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
                isSubscribed: 1,
                isLiked: 1,
                likesCount: 1,
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

const getAllVideos = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const sortBy = req.query.sortBy || "createdAt";
    const sortType = req.query.sortType === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const result = await Video.aggregate([
        {
            $match: {
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {$sort: {[sortBy]: sortType}},
                    {$skip: skip},
                    {$limit: limit},
                ]
            }
        }, 
        {
            $addFields: {
                owner: {$first: "$owner"},
            }
        }, 
        {
            $project: {
                title: 1,
                thumbnail: 1,
                videoFile: 1,
                duration: 1,
                totalVIdeos: 1,
                views: 1,
                createdAt: 1,
                owner: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        }
    ])

    return res 
    .status(200)
    .json(new ApiResponse(200, result, "Videos feed fetched successfully"))
})

const getSingleVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if( !videoId || !videoId.trim() ) throw new ApiError(401, "Video id is not correct")
    const objectId = new mongoose.Types.ObjectId(videoId);

    const video = await Video.findOne({
        _id: objectId
    }).select("-owner -thumbnail")

    if(!video) throw new ApiError(404, "video not found")

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is successfully fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { newTitle, newDescription } = req.body;
    const { videoId } = req.params;

    const thumbnailLocalPath = req.files?.newThumbnail?.[0]?.path;
    const videoLocalPath = req.files?.newVideo?.[0]?.path;

    const updatedFields = {};
    if( newTitle.trim()) {
        updatedFields.title =  newTitle.trim();
    } 
    if( newDescription.trim()) {
        updatedFields.description = newDescription.trim();
    } 

    if(thumbnailLocalPath) {
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!newThumbnail?.secure_url) throw new ApiError(400, "Thumbnail upload failed")

        updatedFields.thumbnail = newThumbnail?.secure_url;
    }

    if(videoLocalPath) {
        const newVideo = await uploadOnCloudinary(videoLocalPath)
        if(!newVideo?.secure_url) throw new ApiError(400, "Video file upload failed")

        updatedFields.videoFile = newVideo?.secure_url;
    }
    
    if(Object.keys(updatedFields).length === 0 ) throw new ApiError(400, "No fields provided for update")

    const updatedVideo = await Video.findByIdAndUpdate(
        {
        _id: videoId,
        owner: req.user._id
        },
        {$set: updatedFields},
        {new: true, runValidators: true}
    )

    if(!updatedVideo) throw new ApiError(404, "Video not found")

    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video file successfully updated"))
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if( !videoId ) throw new ApiError(400, "Video Id is missing or incorrect")

    await Video.findByIdAndDelete(
        {
            _id: videoId,
            owner: req.user._id
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully"))
})

const updateVideoPrivacy = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video id is missing or incorrect")

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    });

    if(!video) throw new ApiError(404, "Video not found"); 

    video.isPublished = !video.isPublished;

    await video.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video privacy status changed successfully"))
})


export {videoUpload, getVideoCreatorDetails, watchVideo, getAllVideos, getSingleVideo, updateVideo, deleteVideo, updateVideoPrivacy };
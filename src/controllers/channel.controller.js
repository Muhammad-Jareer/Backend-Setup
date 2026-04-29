import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const getChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params;
    if(!username) throw new ApiError(400, "username is missing")

    const channel = await User.aggregate([
            {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTO"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedCount: {
                    $size: "$subscribedTO"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                isVerified: 1,
                subscribersCount: 1,
                subscribedCount: 1,
                isSubscribed: 1,
                createdAt: 1
            }
        }
])

    if(!channel?.length) throw new ApiError(404, "Channel does not exist")

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User profile fetched successfully"))
})


const getChannelVideos = asyncHandler(async(req, res) => {
    const {username} = req.params;
    if(!username || !(username.trim())) throw new ApiError(400, "wrong username")

    const [channelVideos] = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videoList"
            }
        },
        {
            $addFields: {
                videoCount: {$size: "$videoList"}
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
                videoCount: 1,
                videoList: {
                $map: {
                input: "$videoList",
                as: "video",
                in: {
                    _id: "$$video._id",
                    title: "$$video.title",
                    thumbnail: "$$video.thumbnail",
                    duration: "$$video.duration",
                    views: "$$video.views",
                    createdAt: "$$video.createdAt"
                }
            }
        }
            }
        }
    ])

    res
    .status(200)
    .json(new ApiResponse(200, channelVideos, "videos successfully fetched"))
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    
})

export { getChannelProfile, getChannelVideos}
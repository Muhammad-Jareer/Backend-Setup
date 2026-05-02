import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const {tweet} = req.body
    if(!tweet || !(tweet.trim() )) throw new ApiError(400, "tweet is required")

    const createdTweet = await Tweet.create({
        owner: req.user._id,
        content: tweet,
    })

    return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, "Tweet is created"))
})

const getAllTweets = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.max(Number(req.query.limit) || 10, 1)
    const sortBy = req.query.sortBy || "createdAt"
    const sortType = req.query.sortType === "asc" ? 1: -1;

    const skip = (page - 1) * limit;

    const result = await Tweet.aggregate([
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
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
                owner: {$first: "$owner"}
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                owner: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, result, "Tweets feed fetched successfully"))
})

const getUserTweet = asyncHandler(async (req, res) => {
    const objectId = new mongoose.Types.ObjectId(req.user._id)

    const userTweet = await Tweet.find({
        owner: objectId
    })
    if(!userTweet) throw new ApiError(400, "user tweets not found")

    return res
    .status(200)
    .json(new ApiResponse(200, userTweet, "User tweets fetched successfully"))
})

const getSignleTweet = asyncHandler(async (req, res) => {
    const{tweetId} = req.params

    const userTweet = await Tweet.findById({
        _id: tweetId
    })
    if(!userTweet) throw new ApiError(400, "user tweet not found")

    return res
    .status(200)
    .json(new ApiResponse(200, userTweet, "User tweet fetched successfully"))
})

const getTweetByUsername = asyncHandler(async (req, res) => {
    const {username} =  req.params;
    const user = await User.findOne({username})
    if (!user) throw new ApiError(404, "User not found");


    const userTweet = await Tweet.find({owner: user._id})

    if(!userTweet || userTweet === 0) throw new ApiError(404, "user dont have any tweets")

    return res
    .status(200)
    .json(new ApiResponse(200, userTweet, "User tweet fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId } =  req.params;
    if(!tweetId) throw new ApiError(400, "Tweet id is missing or incorrect")
    const { newContent } = req.body;
    if(!newContent || !(newContent.trim()) ) throw new ApiError(400, "New Tweet is required to update")

    const tweet = await Tweet.findById(tweetId)
    if(!tweet) throw new ApiError(404, "Tweet not found")
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own tweets");
    }
    tweet.content = newContent;

    await tweet.save({validateBeforeSave: false })

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId } =  req.params;
    if(!tweetId) throw new ApiError(400, "Tweet id is missing or incorrect")

    const deletedTweet = await Tweet.findByIdAndDelete({
        _id: tweetId,
        owner: req.user._id
    })

    if(!deletedTweet) throw new ApiError(404, "Tweet not found or you don't own it")

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video not found or you don't own it"))
})


export {createTweet, getAllTweets, getUserTweet, getSignleTweet, getTweetByUsername, updateTweet, deleteTweet }
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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

export {createTweet}
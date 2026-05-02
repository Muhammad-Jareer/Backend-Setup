import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if(!videoId) throw new ApiError(400, "video id is missing or incorrects");

    const existingLike = await Like.findOne({
        video: videoId,
        owner: req.user._id
    })

    if(existingLike) {
        await Like.deleteOne({
            _id: existingLike._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200, null, "Video is un-liked"))
    }

    await Like.create({
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, null, "video is liked"))
})

export {toggleLike}
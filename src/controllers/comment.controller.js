import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if(!videoId) throw new ApiError(400, "video id is missing or incorrects");
    const {comment} = req.body
    if(!comment || !(comment.trim() )) throw new ApiError(400, "comment is required")

    const createdComment = await Comment.create({
        content: comment,
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201, createdComment, "comment is created"))
})

export {createComment}
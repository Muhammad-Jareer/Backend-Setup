import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {

    const { id, type } = req.params;

    if (!id || !type) {
        throw new ApiError(400, "Missing id or type");
    }

    const existingLike = await Like.findOne({
        likeableId: id,
        likeableType: type,
        owner: req.user._id
    });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json(
            new ApiResponse(200, null, `${type} unliked`)
        );
    }

    await Like.create({
        likeableId: id,
        likeableType: type,
        owner: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, null, `${type} liked`)
    );
});


export {toggleLike}
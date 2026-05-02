import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    likeableId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "likeableType"
    },
    likeableType: {
      type: String,
      required: true,
      enum: ["Video", "Comment", "Tweet"]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Like = mongoose.model("Like", likeSchema);
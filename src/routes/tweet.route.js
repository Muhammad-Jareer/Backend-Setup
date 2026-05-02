import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getSignleTweet, getTweetByUsername, getUserTweet, updateTweet } from "../controllers/tweet.controller.js";
const router = Router();

router.get("/tweet-feed", getAllTweets)
router.get("/signle-tweet/:tweetId", getSignleTweet)
router.get("/tweet-by-user/:username", getTweetByUsername)

// Protected Routes
router.post("/create-tweet", verifyJWT, createTweet);
router.get("/user-tweet", verifyJWT, getUserTweet);
router.patch("/update-tweet/:tweetId", verifyJWT, updateTweet);
router.delete("/delete-tweet/:tweetId", verifyJWT, deleteTweet);


export default router;
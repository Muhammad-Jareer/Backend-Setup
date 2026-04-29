import { Router } from "express";
import { getChannelProfile, getChannelSubscribers, getChannelVideos, subscribeChannel } from "../controllers/channel.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()



router.get("/get-channel-profile/:username", getChannelProfile); 
router.get("/get-channel-videos/:username", getChannelVideos); 

//protected routes
router.get("/:username/subscribers-list", verifyJWT, getChannelSubscribers); 
router.post("/:channelID/subscribe", verifyJWT, subscribeChannel); 



export default router;
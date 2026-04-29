import { Router } from "express";
import { getChannelProfile, getChannelVideos } from "../controllers/channel.controller.js";
const router = Router()



router.get("/get-channel-profile/:username", getChannelProfile); 
router.get("/get-channel-videos/:username", getChannelVideos); 


export default router;
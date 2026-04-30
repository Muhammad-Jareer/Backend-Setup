import { getAllVideos, getVideoCreatorDetails, videoUpload, watchVideo } from "../controllers/video.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.get("/get-video-owner/:videoId", getVideoCreatorDetails)
router.get("/feed", getAllVideos);

// Protected Routes
router.post("/watch-video/:videoId", verifyJWT, watchVideo);
router.post("/video-upload",
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    videoUpload
)

export default router;
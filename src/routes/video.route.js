import { getVideoOwnerDetails, videoUpload, watchVideo } from "../controllers/video.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.get("/get-video-owner/:videoId", getVideoOwnerDetails)
router.post("/watch-video/:videoId", verifyJWT, watchVideo);

// Protected Routes
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
import { deleteVideo, getAllVideos, getSingleVideo, getVideoCreatorDetails, updateVideo, updateVideoPrivacy, videoUpload, watchVideo } from "../controllers/video.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.get("/get-video-owner/:videoId", getVideoCreatorDetails)
router.get("/video-feed", getAllVideos);
router.get("/video/:videoId", getSingleVideo);

// Protected Routes
router.post("/watch-video/:videoId", verifyJWT, watchVideo);
router.delete("/delete-video/:videoId", verifyJWT, deleteVideo);
router.patch("/update-privacy/:videoId/togglePublish", verifyJWT, updateVideoPrivacy);
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

router.patch("/update-video/:videoId",
    verifyJWT,
    upload.fields([
        {
            name: "newVideo",
            maxCount: 1
        },
        {
            name: "newThumbnail",
            maxCount: 1
        }
    ]),
    updateVideo
)



export default router;
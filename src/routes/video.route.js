import videoUpload from "../controllers/video.controller.js";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
const router = Router();

router.post("/video-upload",
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
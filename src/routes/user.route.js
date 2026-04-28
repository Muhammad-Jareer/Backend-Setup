import { Router } from "express";
import { changeCurrentUserPassword, deleteUser, forgotPassword, getUserProfile, loginUser, logoutUser, getChannelProfile, refereshAccessToken, registerUser, resetPassword, updateProfile, verifyEmail, verifyUser, getWatchHistory, getChannelVideos } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

// router.route("/register").post(registerUser)
router.post("/register", 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.post("/login", loginUser )
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password/:token", resetPassword); 
router.post("/verification-email", verifyEmail); 
router.post("/verify-user/:token", verifyUser); 
router.get("/get-channel-profile/:username", getChannelProfile); 
router.get("/get-channel-videos/:username", getChannelVideos); 


//secured routes
router.post("/logout", verifyJWT, logoutUser )
router.post("/referesh-token", refereshAccessToken )
router.post("/change-password", verifyJWT, changeCurrentUserPassword); 
router.post("/profile", verifyJWT, getUserProfile); 
router.post("/profile-update", 
    upload.fields([
        {
            name: "newAvatar",
            maxCount: 1
        },
        {
            name: "newCoverImage",
            maxCount: 1
        }
    ]),
    verifyJWT, updateProfile); 

router.post("/delete-user", verifyJWT, deleteUser); 
router.get("/watch-history/:username", verifyJWT, getWatchHistory); 

export default router;
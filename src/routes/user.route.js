import { Router } from "express";
import { changeCurrentUserPassword, getUserProfile, loginUser, logoutUser, refereshAccessToken, registerUser, updateProfile } from "../controllers/user.controller.js";
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

export default router;
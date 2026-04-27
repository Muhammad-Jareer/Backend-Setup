import { Router } from "express";
import { loginUser, logoutUser, refereshAccessToken, registerUser } from "../controllers/user.controller.js";
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

export default router;
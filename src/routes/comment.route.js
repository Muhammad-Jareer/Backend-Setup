import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";
const router = Router();

router.post("/comment-video/:videoId/comment", verifyJWT, createComment);


export default router;
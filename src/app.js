import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,    
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


//Routes import
import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import channelRouter from "./routes/channel.routes.js"
import likeRouter from "./routes/like.route.js"
import commentRouter from "./routes/comment.route.js"

//Routes Declaration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/channel', channelRouter)
app.use('/api/v1/likes', likeRouter)
app.use('/api/v1/comments', commentRouter)



//  http://localhost:8000/api/v1/users/register

export default app
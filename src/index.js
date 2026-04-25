import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import db_connection from "./db/index.js";
import app from "./app.js";



(async () => {
    try {
        await db_connection()

        app.listen(process.env.PORT, () => {
            console.log(`App is successfully running on port ${process.env.PORT}`);
            console.log("MONGODB_URI:", process.env.MONGODB_URI );
    })
    } catch (error) {
        console.error("DB Connection Error", error);
        throw error
    }
}) ()



// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//         console.log("MongoDB connected successfully ✅");
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on ${process.env.PORT} successfully`);
//         });

//     } catch (error) {
//         console.error("Unable to connect to DB:", error);
//         process.exit(1);
//     }
// })();
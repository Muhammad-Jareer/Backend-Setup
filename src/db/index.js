import mongoose from "mongoose";


import { DB_NAME } from "../constants.js";

const db_connection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log("DB is Successfully connected", connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDB connection FAILED");
        throw error
    }
}

export default db_connection;
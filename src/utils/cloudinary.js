import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) throw new Error("Could not find the local file path");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        console.log("File uploaded Successfully on Cloudinary", response.url);
        return response;
        
    } catch (error) {
        console.log("Upload failed:", error);
    } finally {
        if(localFilePath) {
            try {
            fs.unlinkSync(localFilePath); // remove locally saved temporary file as the upload operation completed/fails
            } catch (error) {
                console.log("Failed to delete local file:", error.message);
            }
        }
    }
    
}

export default uploadOnCloudinary;
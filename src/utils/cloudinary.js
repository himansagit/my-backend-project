import { v2 } from "cloudinary";
import fs from "fs"

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: 279631746534944,
    api_secret: CLOUDINARY_CLOUD_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        //upload the file on cloudinary
        const response = await v2.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully  
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath) //remove localiy saver temp file when upload
        //operation fails
        return null;
    }
}
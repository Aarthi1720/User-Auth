import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async(req, res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed", error.message);
        process.exit(1);           //Exit the app if DB connection fails
    }
}

export default connectDB;
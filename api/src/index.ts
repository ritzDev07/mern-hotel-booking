import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";

// CLOUDINARY CONNECTIONS
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

try {
    cloudinary.config(cloudinaryConfig);
    console.log('Cloudinary connected');
} catch (error) {
    console.error(error);
}

// Connect to MongoDB using the provided connection string
mongoose
    .connect(process.env.MONGODB_CONNECTION as string)
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch((err) => {
        console.log(err);
    })


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.static(path.join(__dirname, "../../client/dist")));

//Handling routes
app.use("/api/auth", authRoutes) // For login user
app.use("/api/users", userRoutes) // Use userRoutes for handling routes under "/api/users"
app.use("/api/my-hotels", myHotelRoutes) //my-hotels routes

app.listen(3100, () => {
    console.log("Server running on localhost:3100");
});
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser"
import path from "path";

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

app.listen(3100, () => {
    console.log("Server running on localhost:3100");
});
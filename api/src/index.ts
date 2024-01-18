import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Handling routes
app.use("/api/users", userRoutes) // Use userRoutes for handling routes under "/api/users"

app.listen(3100, () => {
    console.log("Server running on localhost:3100");
});
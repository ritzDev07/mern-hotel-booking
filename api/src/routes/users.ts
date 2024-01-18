import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

// Create an Express router
const router = express.Router();

// Route to handle user registration
router.post("/register", async (req: Request, res: Response) => {
    try {
        // Check if user with the provided email already exists
        let user = await User.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({
                message: "User Already exist"
            })
        }

        // Create a new User instance with the request body and save it to the database
        user = new User(req.body);
        await user.save();

        // Generate a JWT token for the registered user
        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d"
            }
        );

        // Set the JWT token as an HttpOnly cookie for secure authentication
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        })
        return res.sendStatus(200);

    } catch (error) {
        
        console.log(error);
        res.status(500).send({
            message: "Something went wrong"
        })

    }
});

export default router;
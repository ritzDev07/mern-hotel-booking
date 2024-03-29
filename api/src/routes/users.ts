import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

// Create an Express router
const router = express.Router();

// Route to retrieve information about the currently authenticated user
// ("/me" convention is commonly used in RESTful APIs)
router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

// Route to handle user registration
router.post("/register",

    //Express-validator
    [
        check("firstName", "First Name is Required").isString(),
        check("lastName", "Last Name is Required").isString(),
        check("email", "Email is Required").isEmail(),
        check("password", "8 or more characters required").isLength({ min: 8 }),
    ],
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()
            });
        }

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
            });
            return res.status(200).send({
                message: "User registered OK"
            });

        } catch (error) {

            console.log(error);
            res.status(500).send({
                message: "Something went wrong"
            });

        }
    });

export default router;
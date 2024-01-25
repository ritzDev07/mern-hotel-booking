import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

// Set up in-memory storage for file uploads using Multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
});

// Handle POST requests to '/api/my-hotels' endpoint for uploading hotel data with images
router.post("/", verifyToken,
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Type is required"),
        body("pricePerNight").notEmpty().isNumeric().withMessage("Price Per Night is required"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            // Extract image files and new hotel data from the request
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            // Upload the image files to Cloudinary and get the URLs
            const uplodPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                let dataURI = "data:" + image.mimetype + ";base64," + b64;
                const res = await cloudinary.v2.uploader.upload(dataURI);
                return res.url;

            });
            // Wait for all image uploads to complete
            const imageUrls = await Promise.all(uplodPromises);

            // Attach the image URLs and other details to the new hotel object
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            // Save the new hotel in the database using the Hotel model
            const hotel = new Hotel(newHotel);
            await hotel.save();

            // Return a 201 status with the created hotel object in the response
            res.status(201).send(hotel);
        } catch (error) {
            console.log("error creating hotel:", error);
            res.status(500).json({ message: "Something went wrong" });

        }

    }
);

// Handle GET requests to '/api/my-hotels' endpoint for fetching hotels
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

// Handle GET requests to '/api/my-hotels/:id' endpoint for fetching a specific hotel by ID
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

export default router;
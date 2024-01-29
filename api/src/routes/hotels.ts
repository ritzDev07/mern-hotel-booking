import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();


//Search API endpoint
router.get("/search", async (req: Request, res: Response) => {
    try {

        // Construct search query based on request parameters
        const query = constructSearchQuery(req.query);

        let sortOptions = {};

        // Determine sorting options based on query parameters
        if (req.query.sortOption === "starRating") {
            sortOptions = { starRating: -1 };
        } else if (req.query.sortOption === "pricePerNightAsc") {
            sortOptions = { pricePerNight: 1 };
        } else if (req.query.sortOption === "pricePerNightDesc") {
            sortOptions = { pricePerNight: -1 };
        }

        // Pagination parameters
        const pageSize = 3;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        // Fetch hotels based on query, sort options, and pagination
        const hotels = await Hotel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);

    } catch (error) {
        console.log("error:", error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }

});

// Route to fetch hotels sorted by last updated date HOMEPAGE
router.get("/", async (req: Request, res: Response) => {
    try {
        // Fetch hotels sorted by last updated date
        const hotels = await Hotel.find().sort("-lastUpdated");
        res.json(hotels);
        
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

// Route to fetch a specific hotel by ID
router.get(
    "/:id",
    // Validation middleware for hotel ID
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract the hotel ID from the request parameters
        const id = req.params.id.toString();

        try {
            // Find the hotel in the database by its ID
            const hotel = await Hotel.findById(id);

            // If the hotel is found, send it as a JSON response
            res.json(hotel);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error fetching hotel" });
        }
    }
);

// Route to create payment intent for booking a hotel
router.post(
    "/:hotelId/bookings/payment-intent",
    verifyToken, // Middleware to verify user authentication token
    async (req: Request, res: Response) => {
        // Extracting necessary data from request body and parameters
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        // Finding the hotel by ID
        const hotel = await Hotel.findById(hotelId);
        // If hotel not found, return error response
        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        // Calculating total cost for the booking
        const totalCost = hotel.pricePerNight * numberOfNights;

        // Creating payment intent using Stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100, // Converting amount to cents as per Stripe requirement
            currency: "usd", // Setting currency to USD
            metadata: {
                hotelId,
                userId: req.userId, // Storing user ID in metadata
            },
        });

        // If payment intent creation fails, return error response
        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "Error creating payment intent" });
        }

        // Constructing response object with payment intent details
        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        };


        res.send(response);
    }
);

// Route to create a new booking for a hotel
router.post(
    "/:hotelId/bookings",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            // Extracting payment intent ID from request body
            const paymentIntentId = req.body.paymentIntentId;

            // Retrieving payment intent from Stripe using its ID
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            // If payment intent not found, return error response
            if (!paymentIntent) {
                return res.status(400).json({ message: "Payment intent not found" });
            }

            // Checking if payment intent metadata matches hotel ID and user ID
            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res.status(400).json({ message: "Payment intent mismatch" });
            }

            // Checking if payment intent status is succeeded
            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
                });
            }

            // Creating a new booking object with user ID
            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            };

            // Finding the hotel and pushing the new booking into its bookings array
            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId },
                {
                    $push: { bookings: newBooking },
                }
            );

            // If hotel not found, return error response
            if (!hotel) {
                return res.status(400).json({ message: "Hotel not found" });
            }

            // Saving the updated hotel document
            await hotel.save();

            // Sending success response
            res.status(200).send();

        } catch (error) {
            // Handling errors and sending error response
            console.log(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);


// Function to construct MongoDB query based on request parameters
const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    // Build query based on destination
    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    // Build query based on adult count
    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    // Build query based on child count
    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    // Build query based on facilities
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    // Build query based on hotel types
    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    // Build query based on star ratings
    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    // Build query based on maximum price per night
    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

export default router;
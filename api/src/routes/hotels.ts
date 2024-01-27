import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";

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
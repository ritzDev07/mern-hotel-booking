import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// /api/my-bookings 
// Route to fetch bookings for the authenticated user
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {

        // Find hotels where the user has bookings
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId } },
        });

        const results = hotels.map((hotel) => {

            // Filter user's bookings for the current hotel
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId === req.userId
            );

            // Create hotel object with only user's bookings
            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
});

export default router;
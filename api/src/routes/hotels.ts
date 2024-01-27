import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();

//Search API endpoint
router.get("/search", async (req: Request, res: Response) => {
    try {
        const pageSize = 3;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find().skip(skip).limit(pageSize);

        const total = await Hotel.countDocuments();

        const respone: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize)
            },
        };

        res.json(respone);

    } catch (error) {
        console.log("error:", error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }

});

export default router;
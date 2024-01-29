import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useAppContext } from "../contexts/AppContext";
import { Elements } from "@stripe/react-stripe-js";

// Defining Booking functional component
const Booking = () => {

    const { stripePromise } = useAppContext();

    // Retrieving search context and hotelId from route parameters
    const search = useSearchContext();
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    // Effect to calculate the number of nights when check-in or check-out dates change
    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
                (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    // Query to create payment intent using API client function
    const { data: paymentIntentData } = useQuery(
        "createPaymentIntent",
        () =>
            apiClient.createPaymentIntent(
                hotelId as string,
                numberOfNights.toString()
            ),
        {
            enabled: !!hotelId && numberOfNights > 0,
        }
    );


    const { data: hotel } = useQuery("fetchHotelByID", () =>
        apiClient.fetchHotelById(hotelId as string), {
        enabled: !!hotelId,
    }
    );

    const { data: currentUser } = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    );

    // If hotel data is not available, return an empty fragment
    if (!hotel) {
        return <></>;
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailsSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData && (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: paymentIntentData.clientSecret,
                    }}
                >
                    <BookingForm
                        currentUser={currentUser}
                        paymentIntent={paymentIntentData}
                    />
                </Elements>
            )}
        </div>
    );
};

export default Booking;

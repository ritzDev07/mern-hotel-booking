import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { hotelFacilities } from "../components/icons/HotelFacilites";

const Detail = () => {
    const { hotelId } = useParams();

    const { data: hotel } = useQuery(
        "fetchHotelById",
        () => apiClient.fetchHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );

    if (!hotel) {
        return <></>;
    }

    return (
        <div className="space-y-6">
            <div>
                <span className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar key={index} className="fill-yellow-400" />
                    ))}
                </span>

                <h1 className="text-3xl font-bold">{hotel.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {hotel.imageUrls.map((image, index) => (
                    <div key={index} className="h-[300px]">
                        <img
                            src={image}
                            alt={hotel.name}
                            className="rounded-md w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility, index) => (
                    <div key={index} className="border  border-green-600 rounded-sm p-3">
                        {/* Find the corresponding icon for the facility */}
                        {hotelFacilities.map((item, index) => {
                            if (item.name === facility) {
                                return (
                                    <div key={index} className="flex justify-center items-center space-x-2">
                                        {item.icon}
                                        <span>{facility}</span>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">

                <div className="whitespace-pre-line text-justify mr-6 mb-6">
                    {hotel.description}
                </div>

                <div className="h-fit">
                    <GuestInfoForm
                        pricePerNight={hotel.pricePerNight}
                        hotelId={hotel._id}
                    />
                </div>

            </div>
        </div>
    );
};

export default Detail;
import { Link } from "react-router-dom";
import { HotelType } from "../../../api/src/shared/types";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
type Props = {
    hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
    return (
        <div className="my-3 grid grid-cols-1 md:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-3 gap-6">
            <div className="w-full h-[250px]">
                <img
                    src={hotel.imageUrls[0]}
                    className="w-full h-full object-cover object-center rounded-md"
                />
            </div>
            <div className="grid grid-rows-[.8fr_1fr_1fr]">
                <div>
                    <div className="flex items-center">
                        <span className="flex">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span key={index}>
                                    {index < hotel.starRating ? (
                                        <AiFillStar className="text-yellow-400" />
                                    ) : (
                                        <AiOutlineStar className="text-gray-500" />
                                    )}
                                </span>
                            ))}
                        </span>
                        <span className="ml-1 text-sm">{hotel.type}</span>
                    </div>
                    <Link
                        to={`/detail/${hotel._id}`}
                        className="text-2xl font-bold cursor-pointer"
                    >
                        {hotel.name}
                    </Link>
                </div>

                <div>
                    <div className="line-clamp-4">{hotel.description}</div>
                </div>

                <div className="grid grid-cols-2 items-end whitespace-nowrap">
                    <div className="flex gap-1 items-center">
                        {hotel.facilities.slice(0, 3).map((facility, index) => (
                            <span key={index} className="bg-slate-300 hover:bg-green-500 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                                {facility}
                            </span>
                        ))}
                        <span className="text-sm">
                            {hotel.facilities.length > 3 &&
                                `+${hotel.facilities.length - 3} more`}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-semibold p-1">${hotel.pricePerNight} per night</span>
                        <Link
                            to={`/detail/${hotel._id}`}
                            className="bg-green-600 rounded-md text-white h-full p-3 font-semibold text-xl max-w-fit hover:bg-green-500"
                        >
                            View More
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchResultsCard;
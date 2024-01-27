import { useState, FormEvent } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        search.saveSearchValues(
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount
        );

        navigate("/search");
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return (

        <form
            onSubmit={handleSubmit}
            className="text-sm -mt-8 p-4 bg-amber-400 rounded-sm shadow-md grid lg:grid-cols-4 2xl:grid-cols-4 items-center gap-1"
        >
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={18} className="mr-2" />
                <input
                    placeholder="Where are you going?"
                    className="w-full focus:outline-none"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                />
            </div>

            <div className="flex min-w-full bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        value={adultCount}
                        onChange={(event) => setAdultCount(parseInt(event.target.value))}
                    />
                </label>
                <label className="items-center flex">
                    Children:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        value={childCount}
                        onChange={(event) => setChildCount(parseInt(event.target.value))}
                    />
                </label>
            </div>

            <div className="flex flex-col md:flex-row gap-1">
                <div className="md:w-1/2">
                    <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date as Date)}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Check-in Date"
                        className="w-full bg-white p-2 focus:outline-none"
                        wrapperClassName="w-full"
                    />
                </div>

                <div className="md:w-1/2">
                    <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date as Date)}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Check-out Date"
                        className="w-full bg-white p-2 focus:outline-none"
                        wrapperClassName="w-full"
                    />
                </div>
                
            </div>

            <div className="flex gap-1">

                <button className="w-2/3 rounded-sm bg-blue-600 text-white h-full p-1 font-bold text-lg hover:bg-blue-500">
                    Search
                </button>
                <button className="w-1/3 rounded-sm bg-red-600 text-white h-full p-1 font-bold text-lg hover:bg-red-500">
                    Clear
                </button>

            </div>
        </form>
    );
};


export default SearchBar;

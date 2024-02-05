import { useState, FormEvent, useMemo } from "react";
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
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    // Initialize checkOut with checkIn + 1 day
    const initialCheckOutDate = useMemo(() => {
        const nextDay = new Date(checkIn);
        nextDay.setDate(nextDay.getDate() + 1); // Set checkOut date to one day ahead
        return nextDay;
    }, [checkIn]);
    const [checkOut, setCheckOut] = useState<Date>(initialCheckOutDate);


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
            className="text-sm -mt-8 p-2 bg-amber-400 rounded-sm shadow-md grid lg:grid-cols-4 2xl:grid-cols-4 items-center gap-1"
        >
            <div className="flex flex-row items-center flex-1 bg-white p-4 rounded-sm">
                <MdTravelExplore size={18} className="mr-2" />
                <input
                    placeholder="Where are you going?"
                    className="w-full focus:outline-none"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                />
            </div>

            <div className="flex min-w-full bg-white p-4 gap-2 rounded-sm">
                <label className="items-center flex">
                    Adults:
                    <input
                        className="w-full focus:outline-none font-bold"
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
                        className="w-full focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        value={childCount}
                        onChange={(event) => setChildCount(parseInt(event.target.value))}
                    />
                </label>
            </div>

            <div className="flex flex-col md:flex-row gap-1">
                <div key="checkIn" className="md:w-1/2">
                    <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date as Date)}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Select Check-in Date"
                        dateFormat="eee, MMM d"
                        className="w-full bg-white p-4 focus:outline-none rounded-sm"
                        wrapperClassName="w-full"
                    />
                </div>

                <div key="checkOut" className="md:w-1/2">
                    <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date as Date)}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Check-out Date"
                        dateFormat="eee, MMM d"
                        className="w-full bg-white p-4 focus:outline-none rounded-sm"
                        wrapperClassName="w-full"
                    />
                </div>

            </div>

            <div className="flex gap-1">

                <button className="w-full rounded-sm bordr bg-blue-700 text-white p-3 font-bold text-lg hover:bg-blue-600">
                    Search
                </button>


            </div>
        </form>
    );
};


export default SearchBar;

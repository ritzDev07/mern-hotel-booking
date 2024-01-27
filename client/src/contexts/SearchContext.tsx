import React, { useContext, useState } from "react";

// Define the structure of the search context
type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
    ) => void;
};

// Create a context for search functionality
const SearchContext = React.createContext<SearchContext | undefined>(undefined);

// Define props for the search context provider
type SearchContextProviderProps = {
    children: React.ReactNode;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {

    // Define state variables to hold search values
    const [destination, setDestination] = useState<string>(
        () => sessionStorage.getItem("destination") || ""
    );

    const [checkIn, setCheckIn] = useState<Date>(
        () =>
            new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    );

    const [checkOut, setCheckOut] = useState<Date>(
        () =>
            new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
    );

    const [adultCount, setAdultCount] = useState<number>(
        () =>
            parseInt(sessionStorage.getItem("adultCount") || "1")
    );

    const [childCount, setChildCount] = useState<number>(
        () =>
            parseInt(sessionStorage.getItem("childCount") || "1")
    );

    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelID") || ""
    );

    // Function to save search values to sessionStorage
    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string) => {

        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        if (hotelId) {
            setHotelId(hotelId);
        }

        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultCount", adultCount.toString());
        sessionStorage.setItem("childCount", childCount.toString());

        if (hotelId) {
            sessionStorage.setItem("hotelId", hotelId);
        }
    };

    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

// Hook to consume search context
export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
};
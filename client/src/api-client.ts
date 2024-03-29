import { RegisterFromData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from "../../api/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";

// Define API base URL using environment variables or default value
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Function to fetch information about the current authenticated user from the server
export const fetchCurrentUser = async (): Promise<UserType> => {
    // Send a request to the "/me" endpoint to retrieve user information
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching user");
    }

    return response.json();
};


// Function to register a new user
export const register = async (formData: RegisterFromData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

};

// Function to handle user sign-in
export const signIn = async (formData: SignInFormData) => {

    // Make a POST request to the authentication login endpoint
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message);
    }
    return body;

};

//To validate user token by making a request to the server
export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
};

//Function to perform user sign-out by making a POST request to the logout API endpoint.
export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error during sign out!");
    }
};

// Function to add a new hotel
export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add Hotel");
    }

    return response.json();
};

// Function to fetch user's hotels
export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

// Function to fetch a hotel by its ID
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching Hotels");
    }

    return response.json();
};

// Function to update a hotel by its ID
export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
        `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
        {
            method: "PUT",
            body: hotelFormData,
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update Hotel");
    }

    return response.json();
};



// Define a type for search parameters
export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[],
    stars?: string[],
    maxPrice?: string,
    sortOption?: string,

};

// Function to search hotels based on provided parameters
export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");


    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));


    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

    if (!response.ok) {
        throw new Error("Failed to update Hotel");
    }

    return response.json();
};

// Function to fetch hotels from the server
export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);
    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }
    return response.json();
};

//Fetches a hotel by its ID from the server.
export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

    if (!response.ok) {
        throw new Error("Error fetching Hotels");
    }

    return response.json();
};

// Function to create payment intent for booking
export const createPaymentIntent = async (
    hotelId: string,
    numberOfNights: string
): Promise<PaymentIntentResponse> => {

    // Sending POST request to the server to create payment intent
    const response = await fetch(
        `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, // Endpoint URL
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ numberOfNights }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Error fetching payment intent");
    }

    return response.json();
};

// Function to create a room booking
export const createRoomBooking = async (formData: BookingFormData) => {

    // Sending a POST request to create a room booking
    const response = await fetch(
        `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, // Endpoint URL
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        }
    );

    if (!response.ok) {
        throw new Error("Error booking room");
    }
};

// Function to fetch bookings for the authenticated user
export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to fetch bookings");
    }

    return response.json();
};

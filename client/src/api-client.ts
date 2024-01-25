import { RegisterFromData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from "../../api/src/shared/types";

// Define API base URL using environment variables or default value
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
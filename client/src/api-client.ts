import { RegisterFromData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Define the structure of a toast message
type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
};

// Define the structure of the AppContext
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
};

// Create the AppContext using React's createContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Create a provider component for the AppContext
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });


    // Provide a default value for the context with showToast function
    return (
        <AppContext.Provider
            value={{
                showToast: (toastMessage) => {
                    console.log(toastMessage)
                    setToast(toastMessage);
                },
                isLoggedIn: !isError,
                stripePromise,
            }}>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)}
                />
            )}
            {children}
        </AppContext.Provider>
    )

};

export const useAppContext = () => {
    const context = useContext(AppContext);

    return context as AppContext;
};
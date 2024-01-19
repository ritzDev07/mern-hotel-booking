import React, { useContext, useState } from "react";
import Toast from "../components/Toast";

// Define the structure of a toast message
type ToastMessage = {
    messages: string;
    type: "SUCCESS" | "ERROR";
};

// Define the structure of the AppContext
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
};

// Create the AppContext using React's createContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Create a provider component for the AppContext
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [toast, setToast] = useState<ToastMessage | undefined>(undefined)

    // Provide a default value for the context with showToast function
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                console.log(toastMessage)
                setToast(toastMessage);
            }
        }}>
            {toast && (
                <Toast
                    message={toast.messages}
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
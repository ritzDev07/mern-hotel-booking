import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFromData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {

    const navigate = useNavigate();
    const { showToast } = useAppContext();

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterFromData>();

    const mutation = useMutation(apiClient.register, {
        onSuccess: () => {
            console.log("Registration succesful!");
            showToast({ messages: "Registration succesful!", type: "SUCCESS" })
            // Reset the form after successful submission
            reset();
            navigate("/");
        },
        onError: (error: Error) => {
            console.log(error.message);
            showToast({ messages: error.message, type: "ERROR" })
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit} >
            <h2 className="text-3xl font-bold">Create an Account</h2>

            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1"
                    {...register("firstName", { required: "This field is required" })}>
                    First Name

                    <input
                        name="firstName"
                        className="border rounded w-full py-1 px-2 font-normal">
                    </input>

                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}

                </label>

                <label className="text-gray-700 text-sm font-bold flex-1"
                    {...register("lastName", { required: "This field is required" })}>
                    Last Name

                    <input
                        name="lastName"
                        className="border rounded w-full py-1 px-2 font-normal">
                    </input>

                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}

                </label>
            </div>

            <label className="text-gray-700 text-sm font-bold flex-1"
                {...register("email", { required: "This field is required" })}>
                Email

                <input
                    type="email"
                    name="email"
                    className="border rounded w-full py-1 px-2 font-normal">
                </input>

                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}

            </label>

            <label className="text-gray-700 text-sm font-bold flex-1"
                {...register("password", { required: "This field is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}>
                Password

                <input
                    type="password"
                    name="password"
                    className="border rounded w-full py-1 px-2 font-normal">
                </input>

                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}

            </label>

            <label className="text-gray-700 text-sm font-bold flex-1"
                {...register("confirmPassword", {
                    validate: (val) => {
                        if (!val) {
                            return "this field is required"
                        }
                        else if (watch("password") !== val) {
                            return " Passwords do not match."
                        }

                    }
                })}>
                Confrim Password

                <input
                    type="password"
                    name="confirmPassword"
                    className="border rounded w-full py-1 px-2 font-normal">
                </input>

                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}

            </label>

            <span>
                <button
                    type="submit"
                    className="bg-green-600 text-white p-2 font-bold hover:bg-green-500 text-xl">
                    Create Account
                </button>
            </span>

        </form>
    )
}

export default Register;
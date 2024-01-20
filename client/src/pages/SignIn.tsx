import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";


export type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {

    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const navigate = useNavigate();

    const { register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({ message: "Sign in SuccessFul", type: "SUCCESS" });

            // Invalidate the "validateToken" query in the React Query cache, triggering a refetch
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-5">

            <h2 className="text-3xl font-bold">
                Sign In
            </h2>

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
                {...register("password", {
                    required: "This field is required", minLength: { value: 8, message: "Password must be at least 8 characters" }
                })
                }>
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

            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not registered?
                    <Link
                        className="ml-2 underline text-blue-800 font-semibold"
                        to="/register"
                    >
                        Create an Account
                    </Link>
                </span>
                
                <button
                    type="submit"
                    className="bg-green-600 text-white p-2 font-bold hover:bg-green-500 text-xl">
                    Login
                </button>
            </span>

        </form>
    )
}

export default SignIn;

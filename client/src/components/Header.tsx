import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {

    const { isLoggedIn } = useAppContext();

    return (
        <div className=" bg-green-800 py-6">
            <div className="container mx-auto flex justify-between">

                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to='/'>RitzHotel</Link>
                </span>

                <span className="flex space-x-2 text-xs md:text-lg ">
                    {isLoggedIn ?
                        <>
                            <Link
                                className="flex items-center rounded-sm text-white px-3 font-bold hover:bg-green-700"
                                to="/my-bookings"
                            >
                                My Bookings
                            </Link>

                            <Link
                                className="flex items-center rounded-sm text-white px-3 font-bold hover:bg-green-700"
                                to="/my-hotels"
                            >
                                My Hotels
                            </Link>
                            <SignOutButton />
                        </>
                        :
                        <Link to='/sign-in'
                            className="flex bg-slate-100 items-center rounded-sm text-green-500 px-3 font-bold hover:bg-gray-100 hover:text-green-600">
                            Sign In
                        </Link>
                    }
                </span>

            </div>
        </div>
    )
}

export default Header;

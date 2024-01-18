import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className=" bg-green-800 py-6">
            <div className="container mx-auto flex justify-between">

                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to='/'>RitzHotel</Link>
                </span>

                <span className="flex space-x-2">
                    <Link to='/sign-in'
                        className="flex bg-slate-100 items-center text-green-500 px-3 font-bold hover:bg-gray-100 hover:text-green-600">
                        Sign In
                    </Link>
                </span>

            </div>
        </div>
    )
}

export default Header;

import { Link } from "react-router-dom";
import NotFoundImg from "../assets/NotFound.webp";

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<img
				src={NotFoundImg}
				className="w-100 h-full object-cover object-center"
			/>
			<span className=" text-l">
				<span>
					Page Not Found :/
					<Link
						className="ml-2 underline text-blue-800 font-semibold uppercase"
						to="/"
					>
						back to Homepage
					</Link>
				</span>
			</span>

		</div>
	)
};

export default NotFound;
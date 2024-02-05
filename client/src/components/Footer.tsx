
const Footer = () => {
    return (
        <div className="bg-green-800 py-14 text-xs md:text-lg">
            <div className="container mx-auto flex justify-between items-center gap-4">

                <span className="text-3xl text-white font-bold tracking-tight">
                    RitzHotel
                </span>

                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="cursor-pointer">
                        Privacy Policy
                    </p>
                    <p className="cursor-pointer">
                        Terms of Service
                    </p>
                </span>

            </div>
        </div>
    )
}

export default Footer;

import { useState } from "react";
import { hotelTypes } from "../../config/hotel-options-config";

type Props = {
    selectedHotelTypes: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    // Sort hotel types alphabetically
    const sortedHotelTypes = hotelTypes.sort((a, b) => a.localeCompare(b));

    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">
                Hotel Type
            </h4>

            {/* Display the first 5 items by default, then toggle the rest */}
            {showAll
                ? sortedHotelTypes.map((hotelType, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="rounded"
                            value={hotelType}
                            checked={selectedHotelTypes.includes(hotelType)}
                            onChange={onChange}
                        />
                        <span>{hotelType}</span>
                    </label>
                ))
                : sortedHotelTypes.slice(0, 5).map((hotelType, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="rounded"
                            value={hotelType}
                            checked={selectedHotelTypes.includes(hotelType)}
                            onChange={onChange}
                        />
                        <span>{hotelType}</span>
                    </label>
                ))}
            {/* Button to toggle visibility of all items */}
            {hotelTypes.length > 5 && (
                <button className="text-sm hover:underline font-semibold text-green-600" onClick={toggleShowAll}>
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
};

export default HotelTypesFilter;
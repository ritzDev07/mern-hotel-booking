import { useState } from "react";
import { hotelFacilities } from "../../config/hotel-options-config";

type Props = {
    selectedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    // Sort hotel types alphabetically
    const sortedhotelFacilities = hotelFacilities.sort((a, b) => a.localeCompare(b));

    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Facilities</h4>
            {/* Display the first 5 items by default, then toggle the rest */}
            {showAll
                ? sortedhotelFacilities.map((facility, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="rounded"
                            value={facility}
                            checked={selectedFacilities.includes(facility)}
                            onChange={onChange}
                        />
                        <span>{facility}</span>
                    </label>
                ))
                : sortedhotelFacilities.slice(0, 5).map((facility, index) => (
                    <label key={index} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="rounded"
                            value={facility}
                            checked={selectedFacilities.includes(facility)}
                            onChange={onChange}
                        />
                        <span>{facility}</span>
                    </label>
                ))}
            {/* Button to toggle visibility of all items */}
            {hotelFacilities.length > 5 && (
                <button className="text-sm  hover:underline font-semibold text-green-600" onClick={toggleShowAll}>
                    {showAll ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
};

export default FacilitiesFilter;
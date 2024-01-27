import {
  FaWifi,
  FaParking,
  FaShuttleVan,
  FaBed,
  FaSmokingBan,
  FaSwimmingPool,
  FaSpa,
  FaDumbbell
} from 'react-icons/fa';

// Define the common className
const iconClassName = "text-green-700";

// Define an interface for hotel facilities
interface HotelFacility {
  name: string;
  icon: JSX.Element;
}

// Create an array of hotel facilities with icons and names
export const hotelFacilities: HotelFacility[] = [
  { name: "Free WiFi", icon: <FaWifi className={iconClassName} /> },
  { name: "Parking", icon: <FaParking className={iconClassName} /> },
  { name: "Airport Shuttle", icon: <FaShuttleVan className={iconClassName} /> },
  { name: "Family Rooms", icon: <FaBed className={iconClassName} /> },
  { name: "Non-Smoking Rooms", icon: <FaSmokingBan className={iconClassName} /> },
  { name: "Outdoor Pool", icon: <FaSwimmingPool className={iconClassName} /> },
  { name: "Spa", icon: <FaSpa className={iconClassName} /> },
  { name: "Fitness Center", icon: <FaDumbbell className={iconClassName} /> }
];

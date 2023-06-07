import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import BookingForm from "../src/components/BookingForm";
import { useFetchCars } from "../hooks/useListings";
import { Car } from "../src/types";

// Page with all cars
const Listings = () => {
  let { user } = useContext(AuthContext);

  const cars = useFetchCars();

  return (
    <div className={`flex flex-wrap justify-around`}>
      {cars.map((car: Car) => (
        <div
          key={car.id}
          className={`m-2 w-2/5 shadow-md transition-all duration-300 flex flex-col items-center justify-center rounded-lg bg-color1`}
        >
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-3/4 h-72 object-cover rounded-lg"
          />
          <h2 className={`text-center text-lg my-2`}>
            {car.make} {car.model} ({car.year})
          </h2>
          <p className={`text-center text-base`}>
            <strong>Price per day: </strong>
            {car.pricePerDay}
          </p>

          {/* if user is a particulier, show booking form */}
          {user?.role === "particulier" ? <BookingForm carId={car.id} /> : ""}
        </div>
      ))}
    </div>
  );
};

export default Listings;

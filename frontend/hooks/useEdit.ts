import { useState, useEffect } from "react";
import { getCarById } from "../services/apiCar";
import { User, Car, Booking } from "../src/types";
import { getBookings, getBookingsByUser } from "../services/apiBooking";

// Hook to update car infos
export const useCar = (car: number | Car) => {
  const [carData, setCar] = useState<Car | null>(null);

  useEffect(() => {
    if (typeof car === "number") {
      getCarById(car).then(setCar);
    } else {
      setCar(car);
    }
  }, [car]);

  return { car: carData };
};

// Hook to fetch bookings (all if admin just user's if user)s
export const useFetchBookings = (user: User | null) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookingsAndCarInfos = async () => {
      let userId = user?.id;
      let response = null;
      if (user?.role === "admin") response = await getBookings();
      else response = await getBookingsByUser(userId || 0);

      setBookings(response);
    };

    fetchBookingsAndCarInfos();
  }, [user]);

  return { bookings, setBookings };
};

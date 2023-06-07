import axios from "axios";
import { Booking } from "../src/types";

// API to add a booking
export const postBooking = async (bookingData: Booking) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/bookings",
      bookingData
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

// API to get all bookings
export const getBookings = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/bookings`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// API to get a booking by user
export const getBookingsByUser = async (userId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/bookings/usr/${userId}`
    );
    for (let booking of response.data) booking.car = booking.car.id;
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

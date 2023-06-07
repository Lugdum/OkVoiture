import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";
import { User, Car, Booking } from "../types";
import { useCar } from "../../hooks/useEdit";

interface Arg {
  booking: Booking;
  editing: boolean;
  startDateEdit: string;
  endDateEdit: string;
  handleEditClick: (bookingId: number) => void;
  handleCancelClick: () => void;
  setStartDateEdit: (date: string) => void;
  setEndDateEdit: (date: string) => void;
  submitEditBooking: (bookingId: number) => void;
  deleteBooking: (bookingId: number) => void;
  user: User | null;
}

// Page to manage Bookings
const BookingsPage: React.FC<Arg> = ({
  booking,
  editing,
  startDateEdit,
  endDateEdit,
  handleEditClick,
  handleCancelClick,
  setStartDateEdit,
  setEndDateEdit,
  submitEditBooking,
  deleteBooking,
  user,
}) => {
  // Get car data from API (not practical I should have done like for the user)
  const { car } = useCar(booking.car);

  return (
    <div
      key={booking.id}
      className="w-3/5 mt-7 bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-6"
    >
      {/* If user is editing a booking */}
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitEditBooking(booking.id || 0);
          }}
          className="w-full"
        >
          {/* Ask for new start and end dates */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-6">
            <div className="md:flex-1">
              <label className="block text-gray-700">Start Date:</label>
              <input
                className="block w-full p-2 border-gray-300 rounded-md"
                type="date"
                value={startDateEdit}
                onChange={(e) => setStartDateEdit(e.target.value)}
              />
            </div>
            <div className="md:flex-1">
              <label className="block text-gray-700">End Date:</label>
              <input
                className="block w-full p-2 border-gray-300 rounded-md"
                type="date"
                value={endDateEdit}
                onChange={(e) => setEndDateEdit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              type="submit"
            >
              {/* Submit changes or close on Cancel */}
              Save Changes
            </button>
            <button
              className="w-full py-2 px-4 bg-gray-200 text-black rounded-md hover:bg-gray-300"
              type="button"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Display bookings data */}
          {/* Cool image */}
          <img
            className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
            src={car?.imageUrl || ""}
            alt={`${car?.make} ${car?.model}`}
          />
          {/* All fields (User, Car, Start/End Date) */}
          <div className="md:flex-1">
            {user?.role === "admin" ? (
              <p className="text-gray-700">
                <span className="font-semibold">User :</span>{" "}
                {typeof booking.user !== "number" ? booking.user.name : ""} (
                {typeof booking.user !== "number" ? booking.user.email : ""})
              </p>
            ) : (
              ""
            )}
            <p className="text-gray-700">
              <span className="font-semibold">Car :</span> {car?.model}{" "}
              {car?.make} ({car?.year})
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Start Date:</span>{" "}
              {booking.startDate}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">End Date:</span> {booking.endDate}
            </p>
          </div>
          <div>
            {user?.role === "particulier" ? (
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleEditClick(booking.id || 0)}
              >
                Edit
              </button>
            ) : (
              ""
            )}
            <button
              className="py-2 px-4 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => deleteBooking(booking.id || 0)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsPage;

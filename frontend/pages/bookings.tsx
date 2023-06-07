import React from "react";
import BookingsPage from "../src/components/BookingsPage";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import axios from "axios";
import { useFetchBookings } from "../hooks/useEdit";
import { useUserValidation } from "../hooks/useForm";
import { checkAvailability } from "../services/apiUtils";

// Page to manage Bookings
const EditPage: React.FC = () => {
  // Infos user
  let { user } = useContext(AuthContext);

  // Redirect if user is not a loueur or an admin
  useUserValidation(user, "loueur");

  // Infos Edit Booking
  const [editing, setEditing] = useState<number | null>(null);
  const [startDateEdit, setStartDateEdit] = useState("");
  const [endDateEdit, setEndDateEdit] = useState("");
  const [showConfirmation, setShowConfirmation] = useState("");
  const [showError, setShowError] = useState("");

  const { bookings, setBookings } = useFetchBookings(user || null);

  // Select booking to edit
  const handleEditClick = (id: number) => {
    setEditing(id);
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      setStartDateEdit(booking.startDate);
      setEndDateEdit(booking.endDate);
    }
  };

  // Cancel editing (doesn't work great)
  const handleCancelClick = () => {
    setEditing(null);
    setStartDateEdit("");
    setEndDateEdit("");
  };

  // Call API to edit a booking
  const submitEditBooking = async (id: number) => {
    // Check if dates are good
    if (startDateEdit >= endDateEdit) {
      setShowError("Les dates entrées sont invalides");
      setTimeout(() => setShowError(""), 2000);
      return;
    }
    // Check if car is available
    let carId = bookings.find((b) => b.id === id)?.car || 0;
    if (
      !(await checkAvailability(
        typeof carId === "number" ? carId : 0,
        startDateEdit,
        endDateEdit,
        editing || 0
      ))
    ) {
      setShowError("La voiture n'est pas disponible à cette date");
      setTimeout(() => setShowError(""), 2000);
      return;
    }

    try {
      const bookingResponse = await axios.put(
        `http://localhost:4000/bookings/${id}`,
        {
          startDate: startDateEdit,
          endDate: endDateEdit,
        }
      );

      if (bookingResponse.status !== 200) {
        console.error(bookingResponse.data);
        return;
      }

      bookingResponse.data.car = bookingResponse.data.car.id;

      // Update the booking in the state and popup success
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingResponse.data.id ? bookingResponse.data : booking
      );
      setBookings(updatedBookings);
      setShowConfirmation("Booking Edited");
      setTimeout(() => setShowConfirmation(""), 2000);
      handleCancelClick();
    } catch (error) {
      console.error(error);
    }
  };

  // Call API to delete a booking
  const deleteBooking = async (id: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/bookings/${id}`
      );

      if (response.status !== 200) {
        console.error(response.data);
        return;
      }
      // Remove booking from state and popup success
      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(updatedBookings);
      if (editing === id) handleCancelClick();
      setShowConfirmation("Booking Deleted");
      setTimeout(() => setShowConfirmation(""), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    /* Pop ups on success or errors */
    <div className="flex flex-col items-center space-y-6 mb-7">
      {showConfirmation && (
        <div className="fixed top-12 bg-green-500 text-white font-bold px-4 py-2 rounded mt-4 mr-4 z-50 transition-transform duration-200 transform translate-y-[-100%]">
          {showConfirmation}
        </div>
      )}
      {showError !== "" && (
        <div className="fixed top-12 bg-red-600 text-white font-bold px-4 py-2 rounded mt-4 mr-4 z-50 transition-transform duration-200 transform translate-y-[-100%]">
          {showError}
        </div>
      )}
      {bookings /* Sort by user then by car */
        .sort((a, b) => {
          if (a.user < b.user) {
            return -1;
          } else if (a.user > b.user) {
            return 1;
          } else {
            if (a.car < b.car) {
              return -1;
            } else if (a.car > b.car) {
              return 1;
            } else {
              return 0;
            }
          }
        })
        .map((booking /* Handle bookings managment */) => (
          <BookingsPage
            key={booking.id}
            booking={booking}
            editing={editing === booking.id}
            startDateEdit={startDateEdit}
            endDateEdit={endDateEdit}
            handleEditClick={handleEditClick}
            handleCancelClick={handleCancelClick}
            setStartDateEdit={setStartDateEdit}
            setEndDateEdit={setEndDateEdit}
            submitEditBooking={submitEditBooking}
            deleteBooking={deleteBooking}
            user={user}
          />
        ))}
    </div>
  );
};

export default EditPage;

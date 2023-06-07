import axios from "axios";
import Modal from "react-modal";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { postBooking } from "../../services/apiBooking";
import { checkAvailability } from "../../services/apiUtils";

Modal.setAppElement("#__next");

interface Arg {
  carId: number;
}

// Form from listing page to book a car
const BookingForm: React.FC<Arg> = ({ carId }) => {
  let { user } = useContext(AuthContext);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [messageBooking, setErrorMessageBooking] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: { zIndex: 1000 },
  };

  // Call API to try to book a car
  const submitBooking = async (e: React.FormEvent, carId: number) => {
    e.preventDefault();

    // Check if dates are valid and available
    if (startDate >= endDate) {
      setErrorMessageBooking("Les dates entrées sont invalides");
      return;
    }
    if (!(await checkAvailability(carId, startDate, endDate))) {
      setErrorMessageBooking("La voiture n'est pas disponible à cette date");
      return;
    }

    const bookingData = {
      id: null,
      startDate: startDate,
      endDate: endDate,
      car: carId,
      user: user?.id || 0,
    };

    const bookingResponse = await postBooking(bookingData);

    if (bookingResponse === undefined || bookingResponse.status !== 201) {
      setErrorMessageBooking("Erreur lors de l'ajout de la reservation");
      return;
    }

    // Reset fields and add car to scroll bar
    setErrorMessageBooking("Your booking has been added!");
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      setModalOpen(false);
      setErrorMessageBooking("");
    }, 2000);
  };

  return (
    /* If Book button clicked open Modal */
    <div className="flex flex-col items-center">
      <button
        onClick={() => setModalOpen(true)}
        className="mb-2 px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400"
      >
        Book
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        contentLabel="Booking Dates"
      >
        <form
          onSubmit={(e) => {
            submitBooking(e, carId);
          }}
          className="flex flex-col items-center"
        >
          {messageBooking !== "Your booking has been added!" ? (
            <div className="flex flex-row justify-between w-full mb-2">
              <div className="flex flex-col mr-20">
                <label className="font-bold mt-2 ml-10">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="border-2 rounded-lg p-1 mt-1"
                />
              </div>
              <div className="flex flex-col ml-20">
                <label className="font-bold mt-2 ml-10">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="border-2 rounded-lg p-1 mt-1"
                />
              </div>
            </div>
          ) : (
            ""
          )}
          {/* Notify user that the bookings has been added */}
          {messageBooking && (
            <div
              className={`text-${
                messageBooking === "Your booking has been added!"
                  ? "black"
                  : "red"
              }-500 font-bold text-center`}
            >
              {messageBooking}
            </div>
          )}
          {/* Notify user that an error happened */}
          {messageBooking !== "Your booking has been added!" ? (
            <button
              className="mb-2 px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400"
              type="submit"
              style={{ color: "black" }}
            >
              Book
            </button>
          ) : (
            ""
          )}
        </form>
      </Modal>
    </div>
  );
};

export default BookingForm;

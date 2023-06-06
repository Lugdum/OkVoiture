import axios from "axios";
import Modal from "react-modal";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../src/styles/Listings.module.css";

Modal.setAppElement("#__next");

type BookingFormProps = {
  listingId: string;
};

const BookingForm: React.FC<BookingFormProps> = ({ listingId }) => {
  let { user } = useContext(AuthContext);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessageBooking, setErrorMessageBooking] = useState("");
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

  const checkAvailability = async (carId: string) => {
    // console.log('Checking availability...');
    try {
      const availabilityResponse = await axios.get(
        `http://localhost:4000/bookings/available/${carId}`,
        {
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        }
      );
      if (availabilityResponse.data.length !== 0) {
        // console.log('Car not available');
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const submitBooking = async (e: React.FormEvent, carId: string) => {
    e.preventDefault();
    if (startDate >= endDate) {
      setErrorMessageBooking("Les dates entrées sont invalides");
      return;
    }
    if (!(await checkAvailability(carId))) {
      // console.log('Setting error message');
      setErrorMessageBooking("La voiture n'est pas disponible à cette date");
      return;
    }
    try {
      const bookingResponse = await axios.post(
        "http://localhost:4000/bookings",
        {
          startDate: startDate,
          endDate: endDate,
          car: carId,
          user: user?.id,
        }
      );
      if (bookingResponse.status !== 201) {
        setErrorMessageBooking("Erreur lors de l'ajout de la reservation");
      } else {
        // Reset fields and add car to scroll bar
        setErrorMessageBooking("Your booking has been added!");
        setStartDate("");
        setEndDate("");
        setTimeout(() => {
          setModalOpen(false);
          setErrorMessageBooking("");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setModalOpen(true)}
        className="mb-2 px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400"
      >
        Book
      </button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        contentLabel="Booking Dates"
      >
        <form
          onSubmit={(e) => {
            submitBooking(e, listingId);
          }}
          className="flex flex-col items-center"
        >
          {errorMessageBooking !== "Your booking has been added!" ? (
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
          {errorMessageBooking && (
            <div
              className={`text-${
                errorMessageBooking === "Your booking has been added!"
                  ? "black"
                  : "red"
              }-500 font-bold text-center`}
            >
              {errorMessageBooking}
            </div>
          )}
          {errorMessageBooking !== "Your booking has been added!" ? (
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

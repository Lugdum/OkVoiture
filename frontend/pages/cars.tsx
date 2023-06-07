import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../src/contexts/AuthContext";
import { postCar, deleteCar, updateCar } from "../services/apiCar";
import {
  useFetchCars,
  useFetchBookings,
  useUserValidation,
  useEditFormFields,
} from "../hooks/useForm";
import { Booking } from "@/types";

// Car Infos
export interface Car {
  make: string;
  model: string;
  year: string;
  city: string;
  pricePerDay: string;
  imageUrl: string;
  owner: number;
}

// Page to manage cars
const Form = () => {
  // Get User infos
  let { user } = useContext(AuthContext);

  // Redirect if not logged in as loueur
  useUserValidation(user, "particulier");

  // Car infos
  const { cars, setCars } = useFetchCars(user);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedCarEdit, setSelectedCarEdit] = useState<number | null>(null);
  const [messageCar, setMessageCar] = useState("");

  // Select car infos to edit
  const {
    makeEdit,
    modelEdit,
    cityEdit,
    yearEdit,
    pricePerDayEdit,
    imageEdit,
    setMakeEdit,
    setModelEdit,
    setCityEdit,
    setYearEdit,
    setPricePerDayEdit,
    setImageEdit,
  } = useEditFormFields(selectedCarEdit, cars);

  const { bookingsForSelectedCar, setBookingsForSelectedCar } =
    useFetchBookings(selectedCarEdit);

  // Call API to add a car
  const submitCar = async (e: React.FormEvent) => {
    e.preventDefault();

    const carData = {
      make: make,
      model: model,
      year: year,
      city: city,
      pricePerDay: pricePerDay,
      imageUrl: imageUrl,
      owner: user?.id || 0,
    };

    const carResponse = await postCar(carData);

    if (carResponse === undefined || carResponse.status !== 201) {
      console.error(carResponse?.data);
      return;
    }

    // Reset fields and add car to scroll bar
    setCars([...cars, carResponse.data]);
    setMake("");
    setModel("");
    setYear("");
    setCity("");
    setPricePerDay("");
    setImageUrl("");
  };

  // Call API to modify a car
  const submitEditSelectedCar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCarEdit) {
      const carData = {
        make: makeEdit,
        model: modelEdit,
        year: yearEdit,
        city: cityEdit,
        pricePerDay: pricePerDayEdit,
        imageUrl: imageEdit,
        owner: user?.id || 0,
      };

      const carResponse = await updateCar(selectedCarEdit, carData);

      if (carResponse === undefined || carResponse.status !== 200) {
        console.error(carResponse?.data);
        return;
      }

      // Update car in scroll bar
      const updatedCars = cars.map((car) =>
        car.id === selectedCarEdit ? carResponse.data : car
      );
      setCars(updatedCars);
      setMessageCar("Car updated successfully");
      setTimeout(() => {
        setMessageCar("");
      }, 2000);
    }
  };

  // Call API to delete a car
  const deleteSelectedCar = async () => {
    if (!selectedCarEdit) return;

    const carResponse = await deleteCar(selectedCarEdit);

    if (carResponse === undefined || carResponse.status !== 200) {
      console.error(carResponse?.data);
      return;
    }

    // Delete car in scroll bar
    const updatedCars = cars.filter((car) => car.id !== selectedCarEdit);
    setCars(updatedCars);
    setSelectedCarEdit(null);
    setMessageCar("Car deleted successfully");
    setTimeout(() => {
      setMessageCar("");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      {messageCar && (
  <div
    className={`fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded shadow-md z-50 mt-3`}
  >
    {messageCar}
  </div>
)}
      {/* Form to add a car */}
      {user?.role === "loueur" ? (
        <form
          className={`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md h-[67vh] mt-20 bg-white`}
          onSubmit={submitCar}
        >
          <label>
            <strong>Voiture</strong>
          </label>
          <label>Marque</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />

          <label>Modèle</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />

          <label>Year</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <label>City</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <label>Prix par jour</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
          />

          <label>URL de l&aposimage</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <button
            className={`px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400`}
            type="submit"
            style={{ color: "black" }}
          >
            Ajouter
          </button>
        </form>
      ) : null}

      {/* Form to edit a car */}
      <form
        className={`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md mt-20 ${
          selectedCarEdit
            ? user?.role === "loueur"
              ? "h-[79vh]"
              : "h-[19vh]"
            : "h-[13vh]"
        } bg-white`}
        onSubmit={submitEditSelectedCar}
      >
        <label>
          <strong>Gérer les voitures</strong>
        </label>

        {/* Scroll bar to select a car */}
        <select
          className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
          value={selectedCarEdit || ""}
          required
          onChange={(e) => setSelectedCarEdit(Number(e.target.value))}
        >
          <option value="">-- Choisissez une voiture --</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.make} {car.model} ({car.year})
            </option>
          ))}
        </select>

        {/* Car property fields */}
        {selectedCarEdit && user?.role === "loueur" ? (
          <>
            <label>Make of the car</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={makeEdit}
              onChange={(e) => setMakeEdit(e.target.value)}
              required
            />

            <label>Model of the car</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={modelEdit}
              onChange={(e) => setModelEdit(e.target.value)}
              required
            />

            <label>Price per day</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="number"
              value={pricePerDayEdit}
              onChange={(e) => setPricePerDayEdit(e.target.value)}
              required
            />

            <label>City</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={cityEdit}
              onChange={(e) => setCityEdit(e.target.value)}
              required
            />

            <label>Year</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={yearEdit}
              onChange={(e) => setYearEdit(e.target.value)}
              required
            />

            <label>URL de l&aposimage</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={imageEdit}
              onChange={(e) => setImageEdit(e.target.value)}
              required
            />

            <button
              className={`mb-2 px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400`}
              type="submit"
              style={{ color: "black" }}
            >
              Editer
            </button>
          </>
        ) : (
          ""
        )}

        {/* Delete car button */}
        {selectedCarEdit ? (
          <button
            className={`px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400`}
            type="button"
            style={{ color: "black" }}
            onClick={deleteSelectedCar}
          >
            Supprimer
          </button>
        ) : (
          ""
        )}
        {/* If connected as admin, show all bookings for a car */}
      </form>
      {bookingsForSelectedCar.length !== 0 && user?.role === "admin" ? (
        <div className="`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md mt-20 bg-white">
          <h2 className="text-2xl font-semibold mb-4">
            Bookings for selected car
          </h2>
          {bookingsForSelectedCar.map((booking: Booking) => (
            <div key={booking.id} className="border-t border-gray-200 pt-4">
              <p>Start Date: {booking.startDate}</p>
              <p>End Date: {booking.endDate}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Form;

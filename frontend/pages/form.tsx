import { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../src/styles/Form.module.css";
import { AuthContext } from "../src/contexts/AuthContext";
import { postCar, deleteCar, updateCar } from "../services/api";
import {
  useFetchCars,
  useFetchBookings,
  useUserValidation,
  useEditFormFields,
} from "../hooks/uses";
import { User, Car, Booking } from "../types";

const Form = () => {
  // Get User infos
  let { user } = useContext(AuthContext);

  // Redirect if not logged in as loueur
  useUserValidation(user);

  const { cars, setCars } = useFetchCars(user);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedCarEdit, setSelectedCarEdit] = useState<number | null>(null);
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
    try {
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
        console.log(
          "Erreur lors de l'ajout de la voiture mais ca devrait pas arriver"
        );
      }
      // Reset fields and add car to scroll bar
      else {
        setCars([...cars, carResponse.data]);
        setMake("");
        setModel("");
        setYear("");
        setCity("");
        setPricePerDay("");
        setImageUrl("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitEditSelectedCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
        if (carResponse.status !== 200) {
          console.log(
            "Erreur lors de la modification de la voiture ca devrait pas arriver non plus"
          );
        }
        // Update car in state
        else {
          const updatedCars = cars.map((car) =>
            car.id === selectedCarEdit ? carResponse.data : car
          );
          setCars(updatedCars);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelectedCar = async () => {
    try {
      if (selectedCarEdit) {
        const carResponse = await deleteCar(selectedCarEdit);
        if (carResponse.status !== 200) {
          console.log(
            "Erreur lors de la suppression de la voiture comme d'hab ca arrivera pas"
          );
        } else {
          const updatedCars = cars.filter((car) => car.id !== selectedCarEdit);
          setCars(updatedCars);
          setSelectedCarEdit(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      {/* Form to add a car */}
      {user?.role === "loueur" ? (
        <form
          className={`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md h-[67vh] mt-20 bg-white`}
          onSubmit={submitCar}
        >
          <label className={styles.label}>
            <strong>Voiture</strong>
          </label>
          <label className={styles.label}>Marque</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />

          <label className={styles.label}>Modèle</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />

          <label className={styles.label}>Year</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <label className={styles.label}>City</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <label className={styles.label}>Prix par jour</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
          />

          <label className={styles.label}>URL de l'image</label>
          <input
            className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
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
        <label className={styles.label}>
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
            <label className={styles.label}>Make of the car</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={makeEdit}
              onChange={(e) => setMakeEdit(e.target.value)}
            />

            <label className={styles.label}>Model of the car</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={modelEdit}
              onChange={(e) => setModelEdit(e.target.value)}
            />

            <label className={styles.label}>Price per day</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="number"
              value={pricePerDayEdit}
              onChange={(e) => setPricePerDayEdit(e.target.value)}
            />

            <label className={styles.label}>City</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={cityEdit}
              onChange={(e) => setCityEdit(e.target.value)}
            />

            <label className={styles.label}>Year</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={yearEdit}
              onChange={(e) => setYearEdit(e.target.value)}
            />

            <label className={styles.label}>URL de l'image</label>
            <input
              className={`mb-2 p-2 border border-gray-300 rounded text-lg`}
              type="text"
              value={imageEdit}
              onChange={(e) => setImageEdit(e.target.value)}
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

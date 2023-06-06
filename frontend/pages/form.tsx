import { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../src/styles/Form.module.css";
import { AuthContext } from "../src/contexts/AuthContext";
import { useRouter } from "next/router";

const Form = () => {
  // Get User infos
  let { user } = useContext(AuthContext);
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  // Redirect if not logged in as loueur
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (!user && userFromStorage) {
      user = JSON.parse(userFromStorage);
    }
    if (!user) {
      logout();
      router.push("/");
    }
    if (user?.role === "particulier") {
      router.push("/");
    }
  }, [user, router]);

  // Car infos
  interface Car {
    id: number;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    imageUrl: string;
    owner: number;
  }
  const [cars, setCars] = useState<Car[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedCarEdit, setSelectedCarEdit] = useState<number | null>(null);
  const [makeEdit, setMakeEdit] = useState("");
  const [modelEdit, setModelEdit] = useState("");
  const [cityEdit, setCityEdit] = useState("");
  const [yearEdit, setYearEdit] = useState("");
  const [pricePerDayEdit, setPricePerDayEdit] = useState("");
  const [imageEdit, setImageEdit] = useState("");

  interface Booking {
    id: number;
    startDate: string;
    endDate: string;
  }

  const [bookingsForSelectedCar, setBookingsForSelectedCar] = useState([]);

  // Update cars scroll bar
  useEffect(() => {
    const fetchCars = async () => {
      try {
        if (!user) return;
        let id = user?.id;
        let response = null;
        if (user?.role === "admin")
          response = await axios.get(`http://localhost:4000/cars`);
        else
          response = await axios.get(`http://localhost:4000/cars/usr/${id}`);
        setCars(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCars();
  }, [user?.id]);

  useEffect(() => {
    // Function to fetch the bookings for a car
    const fetchBookingsForCar = async (carId: number) => {
      try {
        const response = await axios.get(`http://localhost:4000/bookings/car/${carId}`);
        if (response.status === 200)
          setBookingsForSelectedCar(response.data);
      } catch (error) {
        console.error('Error fetching bookings for car:', error);
      }
    };
    if (selectedCarEdit)
      fetchBookingsForCar(selectedCarEdit);
    else
      setBookingsForSelectedCar([]);
  }, [selectedCarEdit]);

  // Call API to add a car
  const submitCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carResponse = await axios.post("http://localhost:4000/cars", {
        make: make,
        model: model,
        year: year,
        city: city,
        pricePerDay: pricePerDay,
        imageUrl: imageUrl,
        owner: user?.id,
      });
      if (carResponse.status !== 201) {
        console.log("Erreur lors de l'ajout de la voiture mais ca devrait pas arriver");
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

  const submitEditCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCarEdit) {
        const carResponse = await axios.put(`http://localhost:4000/cars/${selectedCarEdit}`, {
          make: makeEdit,
          model: modelEdit,
          year: yearEdit,
          city: cityEdit,
          pricePerDay: pricePerDayEdit,
          imageUrl: imageEdit,
          owner: user?.id,
        });
        if (carResponse.status !== 200) {
          console.log("Erreur lors de la modification de la voiture ca devrait pas arriver non plus");
        }
        // Update car in state
        else {
          const updatedCars = cars.map(car => car.id === selectedCarEdit ? carResponse.data : car);
          setCars(updatedCars);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCar = async () => {
    try {
      if (selectedCarEdit) {
        const carResponse = await axios.delete(`http://localhost:4000/cars/${selectedCarEdit}`);
        if (carResponse.status !== 200) {
          console.log("Erreur lors de la suppression de la voiture comme d'hab ca arrivera pas");
        }
        // Remove car from state
        else {
          const updatedCars = cars.filter(car => car.id !== selectedCarEdit);
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
      {user?.role === "loueur"? (
        <form className={`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md h-[67vh] mt-20 ${styles.form}`} onSubmit={submitCar}>
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
      <form className={`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md mt-20 ${selectedCarEdit ? (user?.role === "loueur" ? 'h-[79vh]':'h-[19vh]') : 'h-[13vh]'} bg-white`} onSubmit={submitEditCar}>
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
        {(selectedCarEdit && user?.role === "loueur")? (
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

            <label className={styles.label}>Ville</label>
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
        ) : ""}

        {/* Delete car button */}
        {selectedCarEdit? (
          <button
          className={`px-5 py-2 bg-white text-black border border-gray-300 rounded text-lg cursor-pointer transition-colors duration-300 hover:bg-gray-400`}
          type="button"
          style={{ color: "black" }}
          onClick={deleteCar}
          >
          Supprimer
          </button>
        ) : ""}
      </form>
      {(bookingsForSelectedCar.length !== 0 && user?.role === 'admin') ? (
        <div className="`flex flex-col w-96 mx-auto p-5 shadow-md rounded-md mt-20 bg-white">
          <h2 className="text-2xl font-semibold mb-4">Réservations pour la voiture sélectionnée</h2>
          {bookingsForSelectedCar.map((booking: Booking) => (
            <div key={booking.id} className="border-t border-gray-200 pt-4">
              <p>Date de début: {booking.startDate}</p>
              <p>Date de fin: {booking.endDate}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Form;

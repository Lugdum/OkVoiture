import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthContext } from "../src/contexts/AuthContext";
import { User, Car, Booking } from "../types";

export const useFetchCars = (user: User | null) => {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchCars = async () => {
      try {
        let response = null;
        if (user?.role === "admin")
          response = await axios.get(`http://localhost:4000/cars`);
        else
          response = await axios.get(
            `http://localhost:4000/cars/usr/${user.id}`
          );
        setCars(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCars();
  }, [user]);

  return { cars, setCars };
};

export const useFetchBookings = (selectedCarEdit: number | null) => {
  const [bookingsForSelectedCar, setBookingsForSelectedCar] = useState([]);

  useEffect(() => {
    const fetchBookingsForCar = async (carId: number) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/bookings/car/${carId}`
        );
        if (response.status === 200) setBookingsForSelectedCar(response.data);
      } catch (error) {
        console.error("Error fetching bookings for car:", error);
      }
    };

    if (selectedCarEdit) fetchBookingsForCar(selectedCarEdit);
    else setBookingsForSelectedCar([]);
  }, [selectedCarEdit]);

  return { bookingsForSelectedCar, setBookingsForSelectedCar };
};

export const useUserValidation = (user: User | null) => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    let localUser = user;
    const userFromStorage = localStorage.getItem("user");
    if (!localUser && userFromStorage) {
      localUser = JSON.parse(userFromStorage);
    }
    if (!localUser) {
      logout();
      router.push("/");
    }
    if (localUser?.role === "particulier") {
      router.push("/");
    }
  }, [user, router]);
};

export const useEditFormFields = (
  selectedCarId: number | null,
  cars: Car[]
) => {
  const [makeEdit, setMakeEdit] = useState("");
  const [modelEdit, setModelEdit] = useState("");
  const [cityEdit, setCityEdit] = useState("");
  const [yearEdit, setYearEdit] = useState("");
  const [pricePerDayEdit, setPricePerDayEdit] = useState("");
  const [imageEdit, setImageEdit] = useState("");

  useEffect(() => {
    if (selectedCarId) {
      const selectedCar = cars.find((car) => car.id === selectedCarId);
      if (selectedCar) {
        setMakeEdit(selectedCar.make);
        setModelEdit(selectedCar.model);
        setCityEdit(selectedCar.city);
        setYearEdit(selectedCar.year);
        setPricePerDayEdit(selectedCar.pricePerDay);
        setImageEdit(selectedCar.imageUrl);
      }
    } else {
      setMakeEdit("");
      setModelEdit("");
      setCityEdit("");
      setYearEdit("");
      setPricePerDayEdit("");
      setImageEdit("");
    }
  }, [selectedCarId, cars]);

  return {
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
  };
};

import axios from "axios";
import { User, Car, Booking } from "../src/types";

// Car Infos
export interface CarNoId {
  make: string;
  model: string;
  year: string;
  city: string;
  pricePerDay: string;
  imageUrl: string;
  owner: number;
}

// API to get a car infos with id her id
export const getCarById = async (carId: number) => {
  try {
    const response = await axios.get(`http://localhost:4000/cars/${carId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`Pas de voiture avec l'ID ${carId}`);
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

// API to get all cars of a user if parrticulier, or all cars if admin
export const getCars = async (userId: number, role: string) => {
  try {
    let response = null;
    if (role === "admin")
      response = await axios.get(`http://localhost:4000/cars`);
    else response = await axios.get(`http://localhost:4000/cars/usr/${userId}`);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Call API to add a car
export const postCar = async (carData: CarNoId) => {
  try {
    const response = await axios.post("http://localhost:4000/cars", carData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Call API to delete a car
export const deleteCar = async (carId: number) => {
  try {
    const response = await axios.delete(`http://localhost:4000/cars/${carId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Call API to update a car
export const updateCar = async (carId: number, carData: CarNoId) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/cars/${carId}`,
      carData
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

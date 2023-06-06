import axios from "axios";

// User Infos
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// Car Infos
interface Car {
  make: string;
  model: string;
  year: string;
  pricePerDay: string;
  imageUrl: string;
  owner: number;
}

// Booking Infos
interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  pricePerDay: string;
  city: string;
  car: Car;
  user: User;
}

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
export const postCar = async (carData: Car) => {
  try {
    const response = await axios.post("http://localhost:4000/cars", carData);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const deleteCar = async (carId: number) => {
  try {
    const response = await axios.delete(`http://localhost:4000/cars/${carId}`);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCar = async (carId: number, carData: Car) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/cars/${carId}`,
      carData
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

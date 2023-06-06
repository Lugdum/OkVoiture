// User Infos
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Car Infos
export interface Car {
  id: number;
  make: string;
  model: string;
  year: string;
  city: string;
  pricePerDay: string;
  imageUrl: string;
  owner: number;
}

// Booking Infos
export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  pricePerDay: string;
  city: string;
  car: Car;
  user: User;
}

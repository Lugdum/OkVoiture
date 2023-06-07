import axios from "axios";

// Check if a car is available for given dates
export const checkAvailability = async (
  carId: number,
  startDate: string,
  endDate: string,
  editing?: number
) => {
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
    if (
      availabilityResponse.data.length !== 0 &&
      availabilityResponse.data[0].id !== editing
    ) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// API that check the login infos
export const login_ok = async (
  email: string,
  password: string,
  login: Function
) => {
  try {
    const response = await axios.get("http://localhost:4000/users/log", {
      params: { email: email, password: password },
    });

    // console.log(response.data);
    if (!response.data.code) {
      let p = 1;
      if (response.data.role === "particulier") p = 1;
      else if (response.data.role === "loueur") p = 2;
      else if (response.data.role === "admin") p = 3;
      login(response.data, p);
      return p;
    }
  } catch (error) {
    console.error(error);
  }

  return 0;
};

// API to add a user
export const register_ok = async (
  email: string,
  name: string,
  password: string,
  role: string
) => {
  try {
    console.log(email, name, password, role);
    const response = await axios.post("http://localhost:4000/users", {
      email: email,
      name: name,
      password: password,
      role: role,
    });
    console.log(response.data);
    if (!response.data.code) {
      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
};

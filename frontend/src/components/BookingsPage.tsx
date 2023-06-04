import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";

const BookingsPage: React.FC = () => {
  // Get User infos
  let { user } = useContext(AuthContext);
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  // Redirect if not logged in as particulier
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (!user && userFromStorage) {
      user = JSON.parse(userFromStorage);
    }
    if (!user) {
      logout();
      router.push("/");
    }
    if (user?.role === "loueur") {
      router.push("/");
    }
  }, [user, router]);

  // Car Infos
  interface Car {
      id: number;
      make: string;
      model: string;
      year: number;
      imageUrl: string;
  }

    // Booking Infos
    interface Booking {
        id: number;
        startDate: string;
        endDate: string;
        pricePerDay: string;
        city: string;
        car: Car;
        user: number;
    }

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [editing, setEditing] = useState<number | null>(null);
    const [startDateEdit, setStartDateEdit] = useState('');
    const [endDateEdit, setEndDateEdit] = useState('');
    const [errorMessageBooking, setErrorMessageBooking] = useState('');

    useEffect(() => {
      const fetchBookingsAndCarInfos = async () => {
        try {
          let userId = user?.id;
          let response = null;
          if (user?.role === 'admin')
            response = await axios.get(`http://localhost:4000/bookings`);
          else
            response = await axios.get(`http://localhost:4000/bookings/usr/${userId}`);
          const bookingsWithCarIds = response.data;
    
          let carInfoResponses = [];
          for (let i = 0; i < bookingsWithCarIds.length; i++) {
            const carInfoResponse = await axios.get(`http://localhost:4000/cars/${bookingsWithCarIds[i].car.id}`);
            carInfoResponses.push(carInfoResponse.data);
          }
    
          let bookingsWithCarInfos = [];
          for (let i = 0; i < bookingsWithCarIds.length; i++) {
            const bookingWithCarInfo = { ...bookingsWithCarIds[i], car: carInfoResponses[i] };
            bookingsWithCarInfos.push(bookingWithCarInfo);
          }
    
          setBookings(bookingsWithCarInfos);
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchBookingsAndCarInfos();
    }, []);    

      const handleEditClick = (id: number) => {
        setEditing(id);
        // Set the edit fields to the current values of the booking
        const booking = bookings.find(b => b.id === id);
        if (booking) {
          setStartDateEdit(booking.startDate);
          setEndDateEdit(booking.endDate);
        }
      };

    const handleCancelClick = () => {
        setEditing(null);
        setStartDateEdit('');
        setEndDateEdit('');
    };

    const checkAvailability = async (carId: string) => {
      // console.log('Checking availability...');
      try {
        const availabilityResponse = await axios.get(
          `http://localhost:4000/bookings/available/${carId}`,
          {
            params: {
              startDate: startDateEdit,
              endDate: endDateEdit,
            },
          }
        );
        if (availabilityResponse.data.length !== 0 && availabilityResponse.data[0].id !== editing) {
          // console.log('Car not available');
          return false;
        }
        return true;
      }
      catch (error) {
        console.error(error);
        return false;
      }
    };

    // Call API to edit a booking
    const submitEditBooking = async (id: number) => {
        // Check if dates are good
        if (startDateEdit >= endDateEdit) {
          setErrorMessageBooking("Les dates entrées sont invalides");
          return;
        }
        if (!(await checkAvailability(bookings.find(b => b.id === id)?.car.id.toString() || ""))) {
          // console.log('Setting error message');
          setErrorMessageBooking("La voiture n'est pas disponible à cette date");
          return;
        }

        try {
          const bookingResponse = await axios.put(
            `http://localhost:4000/bookings/${id}`,
            {
              startDate: startDateEdit,
              endDate: endDateEdit
            }
          );
    
          if (bookingResponse.status !== 200) {
            // handle error here
            return;
          }
    
          // Update the booking in the state
          const updatedBookings = bookings.map((booking) =>
            booking.id === bookingResponse.data.id
              ? bookingResponse.data
              : booking
          );
          setBookings(updatedBookings);
          handleCancelClick(); // Reset editing state after submission
        } catch (error) {
          console.error(error);
        }
      };
    
      // Call API to delete a booking
      const deleteBooking = async (id: number) => {
        try {
          const response = await axios.delete(
            `http://localhost:4000/bookings/${id}`
          );
    
          if (response.status !== 200) {
            console.error("Erreur lors de la suppression de la réservation");
            return;
          }
          // Remove booking from state
          const updatedBookings = bookings.filter((booking) => booking.id !== id);
          setBookings(updatedBookings);
          if (editing === id) {
            handleCancelClick(); // Reset editing state if deleted booking was being edited
          }
        } catch (error) {
          console.error(error);
        }
      };    

    return (
      <div className="flex flex-col items-center space-y-6 mb-7">
      {bookings.map((booking) => (
          <div key={booking.id} className="w-3/5 mt-7 bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-6">
          {editing === booking.id ? (
              <form onSubmit={(e) => {
                  e.preventDefault();
                  submitEditBooking(booking.id);
              }} className="w-full">
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between md:space-x-6">
                      <div className="md:flex-1">
                          <label className="block text-gray-700">Start Date:</label>
                          <input className="block w-full p-2 border-gray-300 rounded-md" type="date" value={startDateEdit} onChange={(e) => setStartDateEdit(e.target.value)} />
                      </div>
                      <div className="md:flex-1">
                          <label className="block text-gray-700">End Date:</label>
                          <input className="block w-full p-2 border-gray-300 rounded-md" type="date" value={endDateEdit} onChange={(e) => setEndDateEdit(e.target.value)} />
                      </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                      <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Save Changes</button>
                      <button className="w-full py-2 px-4 bg-gray-200 text-black rounded-md hover:bg-gray-300" type="button" onClick={handleCancelClick}>Cancel</button>
                  </div>
              </form>
          ) : (
              <>
              <img
                className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full"
                src={booking.car.imageUrl}
                alt={`${booking.car.make} ${booking.car.model}`}
              />
              <div className="md:flex-1">
                  <p className="text-gray-700"><span className="font-semibold">Car :</span> {booking.car.model} {booking.car.make} ({booking.car.year})</p>
                  <p className="text-gray-700"><span className="font-semibold">Start Date:</span> {booking.startDate}</p>
                  <p className="text-gray-700"><span className="font-semibold">End Date:</span> {booking.endDate}</p>
              </div>
              <div>
                {user?.role === 'particulier'? <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => handleEditClick(booking.id)}>Edit</button> : ""}
                  <button className="py-2 px-4 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => deleteBooking(booking.id)}>Delete</button>
              </div>
              </>
          )}
          </div>
      ))}
  </div>
  
);
};

export default BookingsPage;
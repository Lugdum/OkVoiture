import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../src/styles/Form.module.css';
import { AuthContext } from '../src/contexts/AuthContext';
import { useRouter } from 'next/router';

const Form = () => {
    // Get User infos
    let { user } = useContext(AuthContext);
    const router = useRouter();
    const { logout } = useContext(AuthContext);

    // Redirect if not logged in as loueur
    useEffect(() => {
        const userFromStorage = localStorage.getItem('user');
        if (!user && userFromStorage) {
            user = JSON.parse(userFromStorage);
        }
        if (!user) {
            logout();
            router.push('/');
        }
        if (user?.role === "particulier") {
            router.push('/');
        }
    }, [user, router]);

    // Booking Infos
    interface Booking {
        id: number;
        startDate: string;
        endDate: string;
        pricePerDay: string;
        city: string;
        car: number;
        user: number;
    }
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [errorMessageBooking, setErrorMessageBooking] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [city, setCity] = useState('');
    // Edit Booking Infos
    const [startDateEdit, setStartDateEdit] = useState(selectedBooking?.startDate || '');
    const [endDateEdit, setEndDateEdit] = useState(selectedBooking?.endDate || '');
    const [pricePerDayEdit, setPricePerDayEdit] = useState(selectedBooking?.pricePerDay || '');
    const [cityEdit, setCityEdit] = useState(selectedBooking?.city || '');

    // Car infos
    interface Car {
        id: number;
        make: string;
        model: string;
        year: string;
        imageUrl: string;
        owner: number;
    }
    const [selectedCarEdit, setSelectedCarEdit] = useState<number | null>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCar, setSelectedCar] = useState<number | null>(null);
    const [errorMessageCar, setErrorMessageCar] = useState<string | null>(null);
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Update cars scroll bar
    useEffect(() => {
        const fetchCars = async () => {
            try {
                if (!user)
                    return;
                let id = user?.id;
                const responseCar = await axios.get(`http://localhost:4000/cars/usr/${id}`);
                setCars(responseCar.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCars();
    }, [user?.id]);

    // Update bookings scroll bar
    useEffect(() => {
        const fetchBookings = async () => {
            if (selectedCar) {
                // console.log('Fetching bookings for car', selectedCar);
                const response = await axios.get(`http://localhost:4000/bookings/car/${selectedCar}`);
                setBookings(response.data);
            }
        };
        fetchBookings();
    }, [selectedCar, selectedCarEdit]);

    // Update edit booking scroll bar
    useEffect(() => {
        const fetchBookings = async () => {
            if (selectedCarEdit) {
                // console.log('Fetching bookings for car', selectedCarEdit);
                const response = await axios.get(`http://localhost:4000/bookings/car/${selectedCarEdit}`);
                setBookings(response.data);
                setSelectedBooking(null);
            } else {
                // Reset bookings if no car is selected
                setBookings([]);
            }
        };
        fetchBookings();
    }, [selectedCarEdit]);

    // Reset edit fields when a new booking is selected
    useEffect(() => {
        setStartDateEdit(selectedBooking?.startDate || '');
        setEndDateEdit(selectedBooking?.endDate || '');
        setPricePerDayEdit(selectedBooking?.pricePerDay || '');
        setCityEdit(selectedBooking?.city || '');
    }, [selectedBooking]);    

    // Call API to add a car
    const submitCar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const carResponse = await axios.post('http://localhost:4000/cars', {
                make: make,
                model: model,
                year: year,
                imageUrl: imageUrl,
                owner: user?.id,
            });
            if (carResponse.status !== 201) {
                setErrorMessageCar('Erreur lors de l\'ajout de la voiture');
            }
            // Reset fields and add car to scroll bar
            else {
                setErrorMessageCar(null);
                setCars([...cars, carResponse.data]);
                setMake('');
                setModel('');
                setYear('');
                setImageUrl('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkAvailability = async () => {
        // console.log('Checking availability...');
        try {
            const availabilityResponse = await axios.get(`http://localhost:4000/bookings/available/${selectedCar}`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
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
    
    // Call API to add a booking
    const submitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate >= endDate) {
            setErrorMessageBooking('Les dates entrées sont invalides');
            return;
        }
        if (!await checkAvailability()) {
            // console.log('Setting error message');
            setErrorMessageBooking('La voiture n\'est pas disponible à cette date');
            return;
        }
        try {
            const bookingResponse = await axios.post('http://localhost:4000/bookings', {
                startDate: startDate,
                endDate: endDate,
                pricePerDay: pricePerDay,
                city: city,
                car: selectedCar,
                user: user?.id
            });
            if (bookingResponse.status !== 201) {
                setErrorMessageBooking('Erreur lors de l\'ajout de la reservation');
            }
            else {
                // Reset fields and add car to scroll bar
                setErrorMessageBooking(null);
                setStartDate('');
                setEndDate('');
                setPricePerDay('');
                setCity('');
                setBookings([...bookings, bookingResponse.data]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Call API to edit a booking
    const submitEditBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let id = selectedBooking?.id;
            const bookingResponse = await axios.put(`http://localhost:4000/bookings/${id}`, {
                startDate: startDateEdit,
                endDate: endDateEdit,
                pricePerDay: pricePerDayEdit,
                city: cityEdit
            });
            if (bookingResponse.status !== 200) {
            }
            else {
                // Reset fields and add car to scroll bar
                setErrorMessageBooking(null);
                setStartDateEdit('');
                setEndDateEdit('');
                setPricePerDayEdit('');
                setCityEdit('');
                setSelectedBooking(null);
                setSelectedCarEdit(null);
                const updatedBookings = bookings.map(booking => 
                    booking.id === bookingResponse.data.id ? bookingResponse.data : booking);
                setBookings(updatedBookings);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    // Call API to delete a booking
    const deleteBooking = async () => {
        try {
            let id = selectedBooking?.id;
            const response = await axios.delete(`http://localhost:4000/bookings/${id}`);
    
            if (response.status !== 200) {
                console.error('Erreur lors de la suppression de la réservation');
                return;
            }
    
            // Remove booking from scroll bar
            const updatedBookings = bookings.filter(b => b.id !== id);
            setBookings(updatedBookings);
            setSelectedBooking(null);    
            setSelectedCarEdit(null);
        }
        catch (error) {
            console.error(error);
        }
    }    

    return (
        <div className={`${styles.formDiv}`}>
            {/* Form to add a car */}
            <form className={styles.form} onSubmit={submitCar}>
                <label className={styles.label}><strong>Voiture</strong></label>
                <label className={styles.label}>Marque</label>
                <input className={styles.input} type="text" value={make} onChange={(e) => setMake(e.target.value)} required />

                <label className={styles.label}>Modèle</label>
                <input className={styles.input} type="text" value={model} onChange={(e) => setModel(e.target.value)} required />

                <label className={styles.label}>Année</label>
                <input className={styles.input} type="number" value={year} onChange={(e) => setYear(e.target.value)} required />

                <label className={styles.label}>URL de l'image</label>
                <input className={styles.input} type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

                <button className={styles.button} type="submit" style={{ color: 'black'}}>Ajouter</button>
            </form>
            
            {/* Form to add a booking */}
            <form className={styles.form} onSubmit={submitBooking}>
                <label className={styles.label}><strong>Reservation</strong></label>
                <label className={styles.label}>Date de début</label>
                <input className={styles.input} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

                <label className={styles.label}>Date de fin</label>
                <input className={styles.input} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

                <label className={styles.label}>Prix par jour</label>
                <input className={styles.input} type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required />

                <label className={styles.label}>Ville</label>
                <input className={styles.input} type="text" value={city} onChange={(e) => setCity(e.target.value)} required />

                <label className={styles.label}>Voiture</label>

                {/* Scroll bar to select a car */}
                <select className={styles.input} required onChange={(e) => setSelectedCar(Number(e.target.value))}>
                    <option value="">-- Choisissez une voiture --</option>
                    {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                            {car.make} {car.model} ({car.year})
                        </option>
                    ))}
                </select>

                {errorMessageBooking && <p className='text-red-700 text-lg'>{errorMessageBooking}</p>}

                <button className={styles.button} type="submit" style={{ color: 'black'}}>Ajouter</button>
            </form>

            {/* Form to edit a booking */}
            <form className={styles.form} onSubmit={submitEditBooking}>
                <label className={styles.label}><strong>Gérer les réservations</strong></label>

                {/* Scroll bar to select a car */}
                <select className={styles.input} value={selectedCarEdit || ""} required onChange={(e) => setSelectedCarEdit(Number(e.target.value))}>
                    <option value="">-- Choisissez une voiture --</option>
                    {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                            {car.make} {car.model} ({car.year})
                        </option>
                    ))}
                </select>

                {/* Scroll bar to select a booking */}
                {selectedCarEdit && ( <>
                    <select className={styles.input} value={selectedBooking ? selectedBooking.id : ""} required onChange={(e) => {
                            const booking = bookings.find(b => b.id === Number(e.target.value));
                            setSelectedBooking(booking ? booking : null);
                        }}>
                        <option value="">-- Choisissez une réservation --</option>
                            {bookings.map((booking) => (
                                <option key={booking.id} value={booking.id}>
                                    {booking.startDate} - {booking.endDate} ({booking.city})
                                </option>
                        ))}
                    </select>
                </> )}
                
                {/* Car property fields */}
                {selectedBooking && ( <>
                    <label className={styles.label}>Date de début</label>
                    <input className={styles.input} type="date" value={startDateEdit} onChange={(e) => setStartDateEdit(e.target.value)} />

                    <label className={styles.label}>Date de fin</label>
                    <input className={styles.input} type="date" value={endDateEdit} onChange={(e) => setEndDateEdit(e.target.value)} />

                    <label className={styles.label}>Prix par jour</label>
                    <input className={styles.input} type="number" value={pricePerDayEdit} onChange={(e) => setPricePerDayEdit(e.target.value)} />

                    <label className={styles.label}>Ville</label>
                    <input className={styles.input} type="text" value={cityEdit} onChange={(e) => setCityEdit(e.target.value)} />

                    <button className={styles.button} type="submit" style={{ color: 'black'}}>Editer</button>
                    <button className={styles.button} type="button" style={{ color: 'black'}} onClick={deleteBooking}>Supprimer</button>
                </> )}
            </form>

        </div>
    );
};

export default Form;
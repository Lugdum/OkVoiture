import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import styles from "../src/styles/Listings.module.css";
import BookingForm from "../src/components/BookingForm";

interface Listing {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
}

const Listings = () => {
  let { user } = useContext(AuthContext);

  const [listings, setListings] = useState<Listing[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessageBooking, setErrorMessageBooking] = useState<string | null>();

  useEffect(() => {
    axios
      .get("http://localhost:4000/cars")
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          console.log(res.data[i].imageUrl);
          if (res.data[i].imageUrl === null || res.data[i].imageUrl === "")
            res.data[i].imageUrl =
              "https://static.vecteezy.com/ti/vecteur-libre/p3/3236135-dessin-anime-voiture-couleur-brillante-illustration-pour-enfants-gratuit-vectoriel.jpg";
        }
        setListings(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className={`flex flex-wrap justify-around`}>
      {listings.map((listing) => (
        <div
          key={listing.id}
          className={`m-2 w-2/5 shadow-md transition-all duration-300 flex flex-col items-center justify-center rounded-lg ${styles.customBackground}`}
        >
          <img
            src={listing.imageUrl}
            alt={`${listing.make} ${listing.model}`}
            className="w-3/4 h-72 object-cover rounded-lg"
          />
          <h2 className={`text-center text-lg my-2`}>
            {listing.make} {listing.model} ({listing.year})
          </h2>
          <p className={`text-center text-base`}>
            <strong>Price per day: </strong>
            {listing.pricePerDay}
          </p>

          {user?.role === "particulier"? <BookingForm listingId={listing.id}/> : "" }
        </div>
      ))}
    </div>
  );
};

export default Listings;
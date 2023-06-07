import { useEffect, useState } from "react";
import axios from "axios";

// Hook pour recuperer les infos des voitures
export const useFetchCars = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/cars")
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].imageUrl === null || res.data[i].imageUrl === "")
            res.data[i].imageUrl =
              "https://hips.hearstapps.com/hmg-prod/images/delorean-2000-news-photo-534254818-1547757227.jpg?crop=1.00xw:0.644xh;0,0.238xh&resize=1200:*";
        }
        setListings(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return listings;
};

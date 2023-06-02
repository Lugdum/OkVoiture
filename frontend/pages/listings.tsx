import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../src/styles/Listings.module.css';

interface Listing {
    id: string;
    make: string;
    model: string;
    year: number;
    imageUrl: string;
}

const Listings = () => {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        axios.get('http://localhost:4000/cars')
            .then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                    console.log(res.data[i].imageUrl);
                    if (res.data[i].imageUrl === null || res.data[i].imageUrl === '')
                        res.data[i].imageUrl = "https://static.vecteezy.com/ti/vecteur-libre/p3/3236135-dessin-anime-voiture-couleur-brillante-illustration-pour-enfants-gratuit-vectoriel.jpg";
                }
                setListings(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className={`${styles.listingsContainer}`}>
            {listings.map(listing => (
                <div key={listing.id} className={`${styles.listingCard} ${styles.customBackground ? styles.customBackground : ''}`}>
                    <img src={listing.imageUrl} alt={`${listing.make} ${listing.model}`} />
                    <h2 className={styles.listingTitle}>{listing.make} {listing.model}</h2>
                    <p className={styles.listingYear}><strong>Year: </strong>{listing.year}</p>
                </div>
            ))}
        </div>
    );
};

export default Listings;
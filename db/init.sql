CREATE DATABASE okvoiture;
CREATE DATABASE okvoiture_test;

\c okvoiture

CREATE TYPE user_role AS ENUM ('admin', 'loueur', 'particulier');

CREATE TABLE user_entity (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'particulier'
);

CREATE TABLE car_entity (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    city VARCHAR(255) NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES user_entity (id)
);

CREATE TABLE booking_entity (
    id SERIAL PRIMARY KEY,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "userId" INTEGER NOT NULL,
    "carId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES user_entity (id),
    FOREIGN KEY ("carId") REFERENCES car_entity (id) ON DELETE CASCADE
);

TRUNCATE TABLE public.user_entity RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.car_entity RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.booking_entity RESTART IDENTITY CASCADE;

INSERT INTO public.user_entity(
	id, email, name, password, role)
	VALUES (1, 'admin', 'admin', 'admin', 'admin');

INSERT INTO public.user_entity(
	id, email, name, password, role)
	VALUES (2, 'loueur@gmail.com', 'loueur', '1234', 'loueur');
	
INSERT INTO public.user_entity(
	id, email, name, password, role)
	VALUES (3, 'victor@gmail.com', 'Victor', '1234', 'particulier');

INSERT INTO public.user_entity(
	id, email, name, password, role)
	VALUES (4, 'titouan@gmail.com', 'Titouan', '1234', 'particulier');
	

INSERT INTO public.car_entity(
	id, make, model, year, city, "pricePerDay", "imageUrl", "ownerId")
	VALUES (1, 'Peugeot', '208', 2020, 'Papetee', 50, 'https://cdn.motor1.com/images/mgl/JO3m6Q/s1/4x3/peugeot-208.webp', 2);

INSERT INTO public.car_entity(
	id, make, model, year, city, "pricePerDay", "imageUrl", "ownerId")
	VALUES (2, 'Citroen', 'C3', 2008, 'Papetee', 20, 'https://www.largus.fr/images/images/ORPHEA_105286_1.jpg', 2);
	
INSERT INTO public.car_entity(
	id, make, model, year, city, "pricePerDay", "imageUrl", "ownerId")
	VALUES (3, 'Renault', 'Megane', 2019, 'Papetee', 40, 'https://images.caradisiac.com/images/2/1/2/7/202127/S0-une-voiture-electrique-d-occasion-le-vrai-bon-plan-755449.jpg', 2);
TRUNCATE public.user_entity RESTART IDENTITY CASCADE;
TRUNCATE public.car_entity RESTART IDENTITY CASCADE;
TRUNCATE public.booking_entity RESTART IDENTITY CASCADE;

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
	

INSERT INTO public.booking_entity(
	id, "startDate", "endDate", "userId", "carId")
	VALUES (1, '2023-06-01', '2023-06-03', 3, 1);

INSERT INTO public.booking_entity(
	id, "startDate", "endDate", "userId", "carId")
	VALUES (2, '2023-06-04', '2023-06-06', 4, 1);

INSERT INTO public.booking_entity(
	id, "startDate", "endDate", "userId", "carId")
	VALUES (3, '2023-06-04', '2023-06-09', 3, 2);

INSERT INTO public.booking_entity(
	id, "startDate", "endDate", "userId", "carId")
	VALUES (4, '2023-06-10', '2023-06-11', 4, 2);

INSERT INTO public.booking_entity(
	id, "startDate", "endDate", "userId", "carId")
	VALUES (5, '2023-06-07', '2023-06-09', 3, 1);
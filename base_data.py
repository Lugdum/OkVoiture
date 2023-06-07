import requests

# URL de base de l'API
base_url = "http://localhost:4000"

# Utilisateurs à créer
users = [
    {"id": 1, "email": "admin", "name": "admin", "password": "admin", "role": "admin"},
    {"id": 2, "email": "loueur@gmail.com", "name": "loueur", "password": "1234", "role": "loueur"},
    {"id": 3, "email": "victor@gmail.com", "name": "Victor", "password": "1234", "role": "particulier"},
    {"id": 4, "email": "titouan@gmail.com", "name": "Titouan", "password": "1234", "role": "particulier"},
]

# Voitures à créer
cars = [
    {"id": 1, "make": "Peugeot", "model": "208", "year": 2020, "city": "Papetee", "pricePerDay": 50, "imageUrl": "https://cdn.motor1.com/images/mgl/JO3m6Q/s1/4x3/peugeot-208.webp", "ownerId": 2},
    {"id": 2, "make": "Citroen", "model": "C3", "year": 2008, "city": "Papetee", "pricePerDay": 20, "imageUrl": "https://www.largus.fr/images/images/ORPHEA_105286_1.jpg", "ownerId": 2},
    {"id": 3, "make": "Renault", "model": "Megane", "year": 2019, "city": "Papetee", "pricePerDay": 40, "imageUrl": "https://images.caradisiac.com/images/2/1/2/7/202127/S0-une-voiture-electrique-d-occasion-le-vrai-bon-plan-755449.jpg", "ownerId": 2},
]

# Créer les utilisateurs
for user in users:
    response = requests.post(f"{base_url}/users", json=user)
        
# Créer les voitures
for car in cars:
    response = requests.post(f"{base_url}/cars", json=car)
# OkVoiture

OkVoiture est une plateforme de location de voiture où les particuliers peuvent louer une voiture ou proposer leur voiture à la location.

## Prérequis

Pour lancer ce projet, vous aurez besoin de:

- Docker
- Git
- Node.js et npm

## Installation et lancement du projet avec Docker

1. Clonez ce dépôt Git sur votre machine locale en utilisant la commande suivante :

`git clone [url-du-depot]`

2. Ensuite, naviguez dans le dossier du projet :

`cd OkVoiture`

3. Lancez Docker :

`docker-compose up --build`

Une fois Docker lancé, vous pouvez accéder à l'interface Swagger à l'adresse suivante : `http://localhost:4000/api#/`

## Installation et lancement du projet sans Docker (pour les tests)

1. Naviguez dans le dossier backend :

`cd backend`

2. Installez les dépendances du projet :

`npm install`

3. Lancez le projet :

`npm run start`

4. Dans un autre terminal, revenez au dossier principal du projet et naviguez dans le dossier frontend :

`cd ..`
`cd frontend`

5. Installez les dépendances du projet :

`npm install`

6. Lancez le projet :

`npm run dev`

Le site devrait maintenant être accessible à l'adresse `http://localhost:3000/`.

# OkVoiture

OkVoiture est une plateforme de location de voiture où les particuliers peuvent louer une voiture ou proposer leur voiture à la location.

## Prérequis

Pour lancer ce projet, vous aurez besoin de:

- Docker
- Git
- Node.js et npm

## Installation et lancement du projet avec Docker

1. Clonez ce dépôt Git sur votre machine locale en utilisant la commande suivante :

```bash
git clone https://github.com/Lugdum/OkVoiture.git
```

2. Ensuite, naviguez dans le dossier du projet :

```bash
cd OkVoiture
```

3. Lancez Docker :

```
docker-compose up --build
```

Une fois Docker lancé, vous pouvez accéder à l'interface Swagger à l'adresse suivante : `http://localhost:4000/api#/`  
Le site devrait maintenant être accessible à l'adresse `http://localhost:3000/`.

## Installation et lancement du projet sans Docker (pour les tests)

### Création de la base de données

1. Installez PostgreSQL si ce n'est pas déjà fait. Vous pouvez trouver les instructions d'installation sur le [site officiel de PostgreSQL](https://www.postgresql.org/download/).

2. Ouvrez un terminal et lancez un terminal PostgreSQL en tapant `psql`.

3. Une fois connecté, vous pouvez créer la base de données en utilisant la commande suivante :

```sql
CREATE DATABASE OkVoiture;
```

4. Vous pouvez maintenant vous déconnecter de PostgreSQL en utilisant la commande `\q`.

### Lancement du projet en local

1. Ouvrez le fichier .env a la racine et changez `DB_HOST=db` par `DB_HOST=localhost`, sauvegardez et quittez.

2. Naviguez dans le dossier backend :

```bash
cd backend
```

3. Installez les dépendances du projet :

```
npm install
```

4. Lancez le projet :

```bash
npm run start
```

Ou pour lancer les tests :
```bash
npm test:user
npm test:car
npm test:booking
npm test
```

5. Dans un autre terminal, revenez au dossier principal du projet et naviguez dans le dossier frontend :

```bash
cd frontend
```

6. Installez les dépendances du projet :

```bash
npm install
```

7. Lancez le projet :

```bash
npm run dev
```

Le site devrait maintenant être accessible à l'adresse `http://localhost:3000/`.  
Il n'y a pas de données de base quand on lance en local, il faut créer la 

## Données de base

Les données initiales de l'application sont les suivantes :

### Utilisateurs

| ID | Email               | Nom     | Mot de passe | Rôle        |
|----|---------------------|---------|--------------|-------------|
| 1  | admin               | admin   | admin        | admin       |
| 2  | loueur@gmail.com    | loueur  | 1234         | loueur      |
| 3  | victor@gmail.com    | Victor  | 1234         | particulier |
| 4  | titouan@gmail.com   | Titouan | 1234         | particulier |

### Voitures

| ID | Marque  | Modèle | Année | Ville   | Prix par jour | URL de l'image                                                                                        | ID du propriétaire |
|----|---------|--------|-------|---------|----------------|------------------------------------------------------------------------------------------------------|--------------------|
| 1  | Peugeot | 208    | 2020  | Papetee | 50            | https://cdn.motor1.com/images/mgl/JO3m6Q/s1/4x3/peugeot-208.webp                                     | 2                  |
| 2  | Citroen | C3     | 2008  | Papetee | 20            | https://www.largus.fr/images/images/ORPHEA_105286_1.jpg                                              | 2                  |
| 3  | Renault | Megane | 2019  | Papetee | 40            | https://images.caradisiac.com/images/2/1/2/7/202127/S0-une-voiture-electrique-d-occasion-le-vrai-bon-plan-755449.jpg | 2  |

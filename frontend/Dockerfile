# Utilisez l'image Node.js pour notre application
FROM node:19.9.0

# Créez le répertoire dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste du code de l'application
COPY . .

# Exposez le port que notre application utilise
EXPOSE 3000

# Démarrez l'application
CMD [ "npm", "start" ]

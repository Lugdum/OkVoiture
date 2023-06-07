FROM node:19.9.0

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm install swagger-ui-express
RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]

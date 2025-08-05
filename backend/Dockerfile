FROM node:22

WORKDIR /src/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8000

CMD ["npm", "run", "dev"]
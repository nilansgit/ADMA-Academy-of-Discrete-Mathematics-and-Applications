FROM node:20

WORKDIR /backend

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
# Stage 1 — Build React App
FROM node:20 AS build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BACKEND_URL
ARG VITE_STRAPI_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

RUN npm run build


# Stage 2 — Serve with Nginx
FROM nginx:alpine

COPY --from=build /frontend/dist /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
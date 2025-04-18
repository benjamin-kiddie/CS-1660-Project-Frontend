FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
ENV VITE_API_URL=https://backend-service-866186459758.us-central1.run.app
RUN npm run build

FROM nginx:stable-alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
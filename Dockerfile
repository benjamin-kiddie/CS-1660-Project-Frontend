FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:stable-alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
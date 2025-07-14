FROM node:22-alpine

# Instala dependencias necesarias para la app (sin nginx)
RUN apk add --no-cache yt-dlp ffmpeg jq make g++

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY src/ ./src
COPY public/ ./public
COPY views/ ./views

RUN npm install --target_arch=x64 --target_platform=linux

# Puerto por defecto, puede ser sobrescrito por .env en tiempo de ejecución
ENV APP_PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npm rebuild esbuild && npm run dev"]

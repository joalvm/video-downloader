# Usa una imagen base de Node.js con Alpine para un contenedor ligero
FROM node:22-alpine

# Instala Nginx
RUN apk add --no-cache nginx yt-dlp ffmpeg jq make g++

# Crea los directorios necesarios
WORKDIR /app

# Copia los archivos de la aplicación Node.js
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY src/ ./src
COPY public/ ./public
COPY views/ ./views
# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Instala las dependencias de Node.js
RUN npm install --target_arch=x64 --target_platform=linux

# Expone los puertos necesarios
EXPOSE 80 3000

# Comando para ejecutar Node.js y Nginx juntos
CMD ["sh", "-c", "npm rebuild esbuild && npm run dev & nginx -g 'daemon off;'"]

# Usa una imagen base de Node.js con Alpine para un contenedor ligero
FROM node:22-alpine

# Instala Nginx
RUN apk add --no-cache nginx yt-dlp ffmpeg jq

# Crea los directorios necesarios
WORKDIR /app

# Copia los archivos de la aplicación Node.js
COPY package*.json ./
COPY nodemon.json ./
COPY app.js ./
COPY bin/ ./bin
COPY errors/ ./errors
COPY handlers/ ./handlers
COPY public/ ./public
COPY routes/ ./routes
COPY views/ ./views

# Instala las dependencias de Node.js
RUN npm install --only=dev --prefix /app

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone los puertos necesarios
EXPOSE 80 3000

# Comando para ejecutar Node.js y Nginx juntos
CMD ["sh", "-c", "npm run dev & nginx -g 'daemon off;'"]

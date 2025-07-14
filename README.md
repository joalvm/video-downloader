# Video Downloader

## Instalación

### Crear el archivo `.env`

para esto tenemos que copiar el archivo `.env.example` y renombrarlo a `.env` luego llenar el valor de `APP_KEY=` con algun valor que sirva para encriptación.

### Instalar los paquetes.

```shell
npm install
```

## Uso con Docker Compose

### Construir y levantar los contenedores

```shell
docker compose up --build -d
```

Esto construirá la imagen de la aplicación y levantará los servicios definidos en `docker-compose.yml` (app y nginx).

### Parar los contenedores

```shell
docker compose down
```

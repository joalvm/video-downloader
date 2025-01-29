# Video Downloader

## Instalación

### Crear el archivo `.env`

para esto tenemos que copiar el archivo `.env.example` y renombrarlo a `.env` luego llenar el valor de `APP_KEY=` con algun valor que sirva para encriptación.

### Instalar los paquetes.

```shell
npm install
```

### Construir la imagen docker

```shell
docker build -t youtube-downloader .
```

### Iniciar el contenedor

```shell
docker run -it --rm -p 83:80 -v .:/app youtube-downloader
```

Ahora puedes probarlo usando la ruta `localhost:83`

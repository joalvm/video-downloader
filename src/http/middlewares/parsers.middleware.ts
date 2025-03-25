import {json, urlencoded, Express} from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { express as useragentExpress } from 'express-useragent';

/**
 * Aplica los middlewares esenciales para procesar y manejar datos en Express.
 *
 * @description
 * Configura middlewares para:
 *  - Sobrescribir métodos HTTP (methodOverride).
 *  - Detectar información del agente de usuario (useragentExpress).
 *  - Parsear datos en formato JSON y URL-encoded.
 *  - Manejo de cookies.
 */
function parsersMiddleware(app: Express): void {
    app.use(methodOverride());
    app.use(useragentExpress());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser(process.env.APP_KEY));
}

export default parsersMiddleware;

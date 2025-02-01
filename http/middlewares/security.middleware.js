import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'crypto';

/**
 * Middleware de seguridad para la aplicación.
 *
 * @param {import('express').Express} app - La instancia de la aplicación Express.
 *
 * @description
 * Este middleware configura varias medidas de seguridad para la aplicación:
 * 1. Genera un nonce aleatorio para cada respuesta y lo almacena en `res.locals.nonce`.
 * 2. Configura políticas de seguridad de contenido (CSP) usando Helmet, permitiendo solo fuentes específicas para scripts, estilos, imágenes y fuentes.
 * 3. Habilita CORS para permitir solicitudes desde cualquier origen con métodos específicos.
 * 4. Limita la cantidad de peticiones a 100 por minuto para prevenir abusos.
 *
 * @returns {void}
 */
function securityMiddleware(app) {
    app.use((_, res, next) => {
        res.locals.nonce = randomBytes(16).toString("base64");

        next();
    });

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    (_, res) => `'nonce-${res.locals.nonce}'`,
                    "https://cdn.tailwindcss.com",
                    "https://unpkg.com/lucide@latest"
                ],
                scriptSrcElem: [
                    "'self'",
                    (_, res) => `'nonce-${res.locals.nonce}'`,
                    "https://cdn.tailwindcss.com",
                    "https://unpkg.com/lucide@latest"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // Necesario para Tailwind
                    "https://cdn.tailwindcss.com"
                ],
                imgSrc: ["'self'", "data:", "https://unpkg.com/lucide@latest"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
            },
        },
    }));

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }));

    // Limita la cantidad de peticiones a 100 por minuto.
    app.use(
        rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 100,
            validate: { trustProxy: true },
            keyGenerator: (req) => req.ip,
        })
    );
}

export default securityMiddleware;

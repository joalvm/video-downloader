import { randomBytes } from 'crypto';
import { ServerResponse } from 'node:http';

import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Express, Response, NextFunction, Request } from 'express';

/**
 * Middleware de seguridad para la aplicación.
 *
 * @description
 * Este middleware configura varias medidas de seguridad para la aplicación:
 * 1. Genera un nonce aleatorio para cada respuesta y lo almacena en `res.locals.nonce`.
 * 2. Configura políticas de seguridad de contenido (CSP) usando Helmet, permitiendo solo fuentes específicas para scripts, estilos, imágenes y fuentes.
 * 3. Habilita CORS para permitir solicitudes desde cualquier origen con métodos específicos.
 * 4. Limita la cantidad de peticiones a 100 por minuto para prevenir abusos.
 */
function securityMiddleware(app: Express): void {
    app.use((_, res: Response, next: NextFunction) => {
        res.locals.nonce = randomBytes(16).toString("base64");

        next();
    }).use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    (_, res: ServerResponse) => `'nonce-${(res as Response).locals.nonce}'`,
                    "https://cdn.tailwindcss.com",
                    "https://unpkg.com/lucide@latest",
                ],
                scriptSrcElem: [
                    "'self'",
                    (_, res: ServerResponse) => `'nonce-${(res as Response).locals.nonce}'`,
                    "https://cdn.tailwindcss.com",
                    "https://unpkg.com/lucide@latest",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // Necesario para Tailwind
                    "https://cdn.tailwindcss.com",
                ],
                imgSrc: ["'self'", "data:", "https://unpkg.com/lucide@latest"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
            },
        },
    })).use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })).use(
        rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 100,
            validate: { trustProxy: true },
            keyGenerator: (req: Request): string => req.ip || '',
        })
    );
}

export default securityMiddleware;

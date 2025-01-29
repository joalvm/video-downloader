import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import createHttpError from 'http-errors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import {normalize} from 'path';
import {randomBytes} from 'crypto';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.route.js';
import viewsRoutes from './routes/views.route.js';

dotenvExpand.expand(dotenv.config());

const app = express();

// Middleware para generar nonce en cada request
app.use((_, res, next) => {
    res.locals.nonce = randomBytes(16).toString("base64"); // Nonce único por solicitud

    next();
});

// Seguridad
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

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    }),
);

// Middleware para mejorar rendimiento
app.use(compression());
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minuto
        max: 100, // Limita 100 solicitudes por IP
    }),
);

// Configuración
app.set('views', normalize('./views'));
app.set('view engine', 'ejs');

// Parseadores
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.APP_KEY));

// Archivos estáticos
app.use(express.static(normalize('./public')));

// Rutas
app.use(viewsRoutes);
app.use(apiRoutes);

// Manejo de errores
app.use((_, __, next) => {
    next(createHttpError(404));
});

app.use((err, _, res, next) => {
    res.status(err.status || 500).json({message: err.message});
});

export default app;

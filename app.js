import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import createHttpError from 'http-errors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import {normalize} from 'path';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js';
import viewsRoutes from './routes/views.js';

dotenvExpand.expand(dotenv.config());

const app = express();

// Seguridad
app.use(helmet({contentSecurityPolicy: false}));
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

app.use((err, _, res) => {
    res.status(err.status || 500).json({message: err.message});
});

export default app;

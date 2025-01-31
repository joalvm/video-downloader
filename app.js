import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import {normalize} from 'path';
import apiRoutes from './routes/api.route.js';
import viewsRoutes from './routes/views.route.js';
import securityMiddleware from './middlewares/security.middleware.js';
import parsersMiddleware from './middlewares/parsers.middleware.js';
import performanceMiddleware from './middlewares/performance.middleware.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

dotenvExpand.expand(dotenv.config());

const app = express();

// Configuración de proxy (nueva línea)
app.set('trust proxy', true);

securityMiddleware(app);
parsersMiddleware(app);
performanceMiddleware(app);

// Configuración de vistas
app.set('views', normalize('./views'));
app.set('view engine', 'ejs');

// Archivos estáticos
app.use(express.static(normalize('./public')));

// Rutas
app.use(viewsRoutes);
app.use(apiRoutes);

errorHandlerMiddleware(app);

export default app;

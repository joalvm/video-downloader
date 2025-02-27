import {normalize} from 'node:path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express from 'express';

import securityMiddleware from './http/middlewares/security.middleware.js';
import parsersMiddleware from './http/middlewares/parsers.middleware.js';
import performanceMiddleware from './http/middlewares/performance.middleware.js';
import errorHandlerMiddleware from './http/middlewares/error-handler.middleware.js';
import apiRoutes from './routes/api.route.js';
import viewsRoutes from './routes/views.route.js';

dotenvExpand.expand(dotenv.config());

const app = express();

app.set('trust proxy', true);

securityMiddleware(app);
parsersMiddleware(app);
performanceMiddleware(app);

app.set('views', normalize('./views'));
app.set('view engine', 'ejs');

app.use(express.static(normalize('./public')));

app.use(viewsRoutes);
app.use('/api', apiRoutes);

errorHandlerMiddleware(app);

export default app;

import { dirname, join, normalize } from 'node:path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express, { Express } from 'express';

import securityMiddleware from '@/http/middlewares/security.middleware';
import parsersMiddleware from '@/http/middlewares/parsers.middleware';
import performanceMiddleware from '@/http/middlewares/performance.middleware';
import errorHandlerMiddleware from '@/http/middlewares/error-handler.middleware';
import apiRoutes from '@/routes/api.route';
import viewsRoutes from '@/routes/views.route';

dotenvExpand.expand(dotenv.config());

const app: Express = express();

app.set('trust proxy', true);

securityMiddleware(app);
parsersMiddleware(app);
performanceMiddleware(app);

app.set('views', normalize(join(dirname(__filename), '..', 'views')));
app.set('view engine', 'ejs');

app.use(express.static(normalize(join(dirname(__filename), '..', 'public'))));

app.use(viewsRoutes);

app.use('/api', apiRoutes);

errorHandlerMiddleware(app);

export default app;

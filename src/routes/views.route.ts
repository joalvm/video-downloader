import { Router } from 'express';

import homeController from '@/http/controllers/home.controller';

const routes = Router();

routes.get('/', (_, res) => homeController.index(res));

export default routes;

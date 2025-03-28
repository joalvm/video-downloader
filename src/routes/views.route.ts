import { Router } from 'express';

import homeController from '@/http/controllers/home.controller';

const routes = Router();

routes.get('/', homeController.index.bind(homeController));

export default routes;

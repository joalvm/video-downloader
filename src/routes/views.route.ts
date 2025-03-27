import { Router } from 'express';

import homeHandler from '@/http/handlers/home.handler';

const routes = Router();

routes.get('/', homeHandler);

export default routes;

import {Router} from 'express';

import homeHandler from '../http/handlers/home.handler.js';

const routes = Router();

routes.get('/', homeHandler);

export default routes;

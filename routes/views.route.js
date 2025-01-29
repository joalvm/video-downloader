import {Router} from 'express';
import homeHandler from '../handlers/home.handler.js';

const routes = Router();

routes.get('/', homeHandler);

export default routes;

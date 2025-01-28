import {Router} from 'express';

const routes = Router();

routes.get('/', (_, res) => {
    res.render('index');
});

export default routes;

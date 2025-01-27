const {Router} = require('express');

const routes = Router();

routes.get('/', (_, res) => {
    res.render('index');
});

module.exports = routes;

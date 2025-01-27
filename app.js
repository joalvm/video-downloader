const express = require('express');
const createHttpError = require('http-errors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');
const viewsRoutes = require('./routes/views');

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Middleware para servir archivos estáticos
app.use(express.static(join(__dirname, 'public')));

app.use(viewsRoutes);
app.use(apiRoutes);

// catch 404 and forward to error handler
app.use(function (_, __, next) {
    next(createHttpError(404));
});

// Handle errors
app.use((err, _, res) => {
    console.error('Error controlado: ', err);

    res.status(err?.statusCode || 500).json({message: err.message});
});

module.exports = app;

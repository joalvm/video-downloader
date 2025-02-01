import createHttpError from "http-errors";

/**
 * Middleware de manejo de errores.
 *
 * Crea un manejador para rutas no encontradas (404) y gestiona de forma
 * general los errores capturados en la aplicación.
 *
 * @param {import('express').Express} app - La instancia de la aplicación de Express.
 *
 * @returns {void}
 */
function errorHandlerMiddleware(app) {
    // Manejo de errores 404
    app.use((_, __, next) => {
        next(createHttpError(404));
    });

    // Manejo general de errores
    app.use((err, _, res, __) => {
        res.status(err.status || 500).json({ message: err.message });
    });
}

export default errorHandlerMiddleware;

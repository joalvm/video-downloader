import createHttpError, { HttpError } from 'http-errors';
import { Express, Request, Response, NextFunction } from 'express';

/**
 * Middleware de manejo de errores.
 *
 * Crea un manejador para rutas no encontradas (404) y gestiona de forma
 * general los errores capturados en la aplicación.
 */
function errorHandlerMiddleware(app: Express) {
    // Manejo de errores 404
    app.use((_: Request, __: Response, next: NextFunction) => {
        next(createHttpError(404));
    });

    // Manejo general de errores
    app.use((err: HttpError, _: Request, res: Response, next: NextFunction) => {
        console.log(err);
        res.status(err.status || 500).json({ message: err.message });
        next();
    });
}

export default errorHandlerMiddleware;

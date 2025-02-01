import compression from 'compression';
import morgan from 'morgan';

/**
 * Aplica middlewares de compresión y registro de solicitudes para mejorar el rendimiento de la aplicación.
 *
 * @param {import('express').Express} app - La instancia de la aplicación de Express.
 * @description
 *  Configura middlewares para:
 *  - Comprimir respuestas con Gzip.
 *  - Registrar solicitudes en la consola.
 *
 *
 * @returns {void}
 */
function performanceMiddleware(app) {
    app.use(compression());
    app.use(morgan(
        process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    ));
}

export default performanceMiddleware;

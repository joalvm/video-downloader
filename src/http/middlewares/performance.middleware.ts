import compression from 'compression';
import morgan from 'morgan';
import { Express } from 'express';

/**
 * Aplica middlewares de compresión y registro de solicitudes para mejorar el rendimiento de la aplicación.
 *
 * @description
 *  Configura middlewares para:
 *  - Comprimir respuestas con Gzip.
 *  - Registrar solicitudes en la consola.
 */
function performanceMiddleware(app: Express): void {
    app.use(compression());
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

export default performanceMiddleware;

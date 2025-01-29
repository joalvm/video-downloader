import {Router} from 'express';
import proxyHandle from '../handlers/proxy.handler.js';
import infoHanlder from '../handlers/info.handler.js';
import downloadHandler from '../handlers/download.handler.js';

const routes = Router();

// Ruta para obtener miniaturas de videos
routes.get('/proxy', proxyHandle);
// Muestra información del video
routes.get('/info', infoHanlder);
// Ruta para descargar un video
routes.post('/download', downloadHandler);

export default routes;

import { Router } from 'express';

import proxyHandle from '@http/handlers/proxy.handler';
import infoHanlder from '@http/handlers/info.handler';
import downloadHandler from '@http/handlers/download.handler';

const routes = Router();

// Ruta para obtener miniaturas de videos
routes.get('/proxy', proxyHandle);
// Muestra información del video
routes.get('/info', infoHanlder);
// Ruta para descargar un video
routes.post('/download', downloadHandler);

export default routes;

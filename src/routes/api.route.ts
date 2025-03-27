import { Router } from 'express';

import ProxyController from '@/http/controllers/proxy.controller';
import VideoController from '@/http/controllers/video.controller';

const routes = Router();

// Ruta para obtener miniaturas de videos
routes.get('/proxy', ProxyController.index);
// Muestra información del video
routes.get('/video/info', VideoController.info);
// Ruta para descargar un video
routes.post('/video/download', VideoController.download);

export default routes;

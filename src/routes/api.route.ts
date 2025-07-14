import { Router } from 'express';

import ProxyController, { ProxyRequest } from '@/http/controllers/proxy.controller';
import VideoController, { DownloadRequest, InfoRequest } from '@/http/controllers/video.controller';

const routes = Router();

// Ruta para manejar los thumbails.
routes.get('/proxy', (req: ProxyRequest, res) => ProxyController.index(req, res));
// Muestra información del video
routes.get('/video/info', (req: InfoRequest, res) => VideoController.info(req, res));
// Ruta para descargar un video
routes.post('/video/download', (req: DownloadRequest, res) => VideoController.download(req, res));

export default routes;

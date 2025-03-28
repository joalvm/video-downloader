import { Readable } from 'node:stream';
import { ReadableStream as NodeReadableStream } from 'node:stream/web';

import { Request, Response } from 'express';

import InvalidOrMissingUrlError from '@/errors/invalid-or-missing-url.error';

interface ProxyRequest extends Request {
    query: { url: string };
}

class ProxyController {
    /**
     * Manejador proxy para obtener y transmitir recursos externos.
     */
    async index(req: ProxyRequest, res: Response) {
        const { url } = req.query;

        if (!url) {
            throw new InvalidOrMissingUrlError();
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        Readable.fromWeb(response.body as unknown as NodeReadableStream).pipe(res);
    }
}

export default new ProxyController();

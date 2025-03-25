import { Readable } from 'node:stream';
import { Request, Response } from 'express';

import InvalidOrMissingUrlError from '@errors/invalid-or-missing-url.error';

type ProxyRequest = Request<{}, {}, {}, { url: string }>;

/**
 * Manejador proxy para obtener y transmitir recursos externos.
 */
async function proxyHandler(req: ProxyRequest, res: Response) {
    const { url } = req.query;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    const response = await fetch(url as string);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
        throw new Error('Response body is null');
    }

    Readable.fromWeb(response.body as any).pipe(res);
}

export default proxyHandler;

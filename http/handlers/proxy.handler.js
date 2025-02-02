import {Readable} from 'node:stream';

import InvalidOrMissingUrlError from '../../errors/invalid-or-missing-url.error.js';

/**
 * Manejador proxy para obtener y transmitir recursos externos.
 *
 * @async
 *
 * @param {import('express').Request<{}, {}, {}, {url?: string}>} req
 * @param {import('express').Response<void>} res
 */
async function proxyHandler(req, res) {
    const {url} = req.query;

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

    Readable.fromWeb(response.body).pipe(res);
}

export default proxyHandler;

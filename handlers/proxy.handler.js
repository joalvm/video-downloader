import {Readable} from 'node:stream';
import InvalidOrMissingUrlError from '../errors/invalid-or-missing-url.error.js';

async function proxyHandler(req, res) {
    try {
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
    } catch (error) {
        res.status(500).send('Error al procesar la imagen');
    }
}

export default proxyHandler;

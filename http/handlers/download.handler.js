import {basename} from 'path';
import {join} from 'path';
import {tmpdir} from 'node:os';
import {download} from '../../utils/yt-dlp.util.js';
import InvalidOrMissingUrlError from '../../errors/invalid-or-missing-url.error.js';

const OUTPUT_DIR = join(tmpdir(), 'downloads');

/**
 *
 * Manejador para descargar un video desde una URL proporcionada.
 *
 * @async
 *
 * @param {import('express').Request<{}, {}, {url?: string}>} req
 * @param {import('express').Response<void>} res
 *
 * @returns {Promise<void>}
 */
async function downloadHandler(req, res) {
    const {url} = req.body;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    const filepath = await download(url, OUTPUT_DIR);

    res.download(filepath, basename(filepath), (err) => {
        if (err) {
            console.error('Error sending file:', err);
        }
    });
}

export default downloadHandler;

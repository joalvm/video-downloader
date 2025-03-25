import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

import { Request, Response } from 'express';

import { download } from '@utils/yt-dlp.util';
import InvalidOrMissingUrlError from '@errors/invalid-or-missing-url.error';

type DownloadFormat = 'video' | 'audio' | 'video_audio';

type DownloadRequest = Request<{}, {}, { url: string; format?: DownloadFormat }>;

/**
 *
 * Manejador para descargar un video desde una URL proporcionada.
 */
async function downloadHandler(req: DownloadRequest, res: Response) {
    const { url } = req.body;
    let { format } = req.body;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    if (!format) {
        format = 'video_audio';
    }

    if (!['video', 'audio', 'video_audio'].includes(format)) {
        throw new Error('Invalid format');
    }

    const filepath = await download(url, join(tmpdir(), 'downloads'), format);

    res.download(filepath, basename(filepath), (err) => {
        if (err) {
            console.error('Error sending file:', err);
        }
    });
}

export default downloadHandler;

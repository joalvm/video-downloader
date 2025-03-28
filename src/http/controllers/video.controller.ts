import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

import { Request, Response } from 'express';

import InvalidOrMissingUrlError from '@/errors/invalid-or-missing-url.error';
import { info, download, VideoFormat } from '@/shared/utils/yt-dlp.util';

interface InfoRequest extends Request {
    query: { url: string };
}

interface downloadRequest extends Request {
    body: { url: string; format: VideoFormat };
}

class VideoController {
    /**
     *
     * Handler to get video info from a provided URL.
     */
    async info(req: InfoRequest, res: Response) {
        const { url } = req.query;

        if (!url) {
            throw new InvalidOrMissingUrlError();
        }

        res.json(await info(url));
    }

    async download(req: downloadRequest, res: Response) {
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

        res.download(filepath, basename(filepath), (err: Error | null) => {
            if (err) {
                console.error('Error sending file:', err);
            }
        });
    }
}

export default new VideoController();

import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';

import { Request, Response } from 'express';

import InvalidOrMissingUrlError from "@/errors/invalid-or-missing-url.error";
import { info, download } from '@/shared/utils/yt-dlp.util';

class YtdlpController {
    /**
     *
     * Handler to get video info from a provided URL.
     */
    async info(req: Request, res: Response) {
        const { url } = req.query;

        if (!url) {
            throw new InvalidOrMissingUrlError();
        }

        res.json(await info(url as string));
    }

    async download(req: Request, res: Response) {
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

export default new YtdlpController();

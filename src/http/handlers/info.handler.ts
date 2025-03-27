import { Request, Response } from 'express';

import InvalidOrMissingUrlError from "@/errors/invalid-or-missing-url.error";
import { info } from "@/utils/yt-dlp.util";

/**
 *
 * Handler to get video info from a provided URL.
 */
async function infoHanlder(req: Request, res: Response): Promise<void> {
    const { url } = req.query;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    res.json(await info(url as string));
}

export default infoHanlder;

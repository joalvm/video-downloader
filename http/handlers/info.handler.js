import InvalidOrMissingUrlError from "../../errors/invalid-or-missing-url.error.js";
import { info } from "../../utils/yt-dlp.util.js";

/**
 *
 * Handler to get video info from a provided URL.
 *
 * @async
 *
 * @param {import('express').Request<{}, {}, {}, {url?: string}>} req
 * @param {import('express').Response<void>} res
 *
 * @returns {void}
 */
async function infoHanlder(req, res) {
    const {url} = req.query;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    return res.json(await info(url));
}



export default infoHanlder;

import {exec} from 'child_process';
import InvalidOrMissingUrlError from "../errors/invalid-or-missing-url.error.js";
import createHttpError from 'http-errors';

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

    return info(url)
        .then((info) => {
            res.json(info)
        })
        .catch(() => {
            res.status(406).json({message: 'Failed to get video info'});
        });
}

async function info(url) {
    return new Promise((resolve, reject) => {
        exec(`yt-dlp --print-json --skip-download ${url}`, {encoding: 'utf-8'}, (error, stdout, stderr) => {
            if (error) {
                reject(error);

                return;
            }

            const content = JSON.parse(stdout?.toString()?.trim() || '');

            if (!content) {
                reject(new Error('Failed to get video info'));

                return;
            }

            resolve(content);
        });
    });
}

export default infoHanlder;

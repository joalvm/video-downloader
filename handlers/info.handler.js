import {exec} from 'child_process';
import InvalidOrMissingUrlError from "../errors/invalid-or-missing-url.error.js";
import EmptyInfoResponseError from '../errors/empty-info-response.error.js';
import InvalidParseInfoError from '../errors/invalid-parse-info.error.js';

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

    const content = await info(url);

    return res.json(content);
}

/**
 * Get video info from the provided URL.
 *
 * @param {string} url
 * @returns {Promise<{title: string, thumbnail: string, duration: number, formats: object[]}>}
 */
async function info(url) {
    return new Promise((resolve, reject) => {
        const command = [
            'yt-dlp',
            '--print', `'{
                "title": %(title)j,
                "thumbnail": %(thumbnail)j,
                "duration": %(duration)j,
                "description": %(description)j,
                "formats": %(formats)j
            }'`,
            '--skip-download',
            url,
        ].join(' ');

        exec(command, {encoding: 'utf-8'}, (error, stdout, stderr) => {
            if (error) {
                reject(error);

                return;
            }

            if (!stdout?.toString()?.trim()) {
                reject(new EmptyInfoResponseError());

                return;
            }

            try {
                resolve(JSON.parse(stdout?.toString()?.trim() || ''));
            } catch (error) {
                reject(new InvalidParseInfoError());
            }
        });
    });
}

export default infoHanlder;

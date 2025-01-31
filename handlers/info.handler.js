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
            '--ignore-errors',
            '--print-json',
            '--skip-download',
            `"${url}"`,
        ].join(' ');

        exec(command, {encoding: 'utf-8'}, (error, stdout, stderr) => {
            if (error) {
                reject(error);

                return;
            }

            const content = stdout?.toString()?.trim();

            if (!content) {
                reject(new EmptyInfoResponseError());

                return;
            }

            try {
                const data = JSON.parse(content);

                resolve({
                    id: data?.id,
                    artist: data?.artist,
                    title: data?.title,
                    description: data.description,
                    thumbnail: data.thumbnail || data.url,
                    duration: data?.duration,
                    extractor: data?.extractor,
                    extractor_key: data?.extractor_key,
                    filesize: data?.filesize,
                    ext: data?.ext,
                    width: data?.width,
                    height: data?.height,
                    formats: data?.formats || [],
                });
            } catch (error) {
                reject(new InvalidParseInfoError());
            }
        });
    });
}

export default infoHanlder;

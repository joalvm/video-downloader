import { execFile } from "node:child_process";

import EmptyInfoResponseError from '../errors/empty-info-response.error.js';
import InvalidParseInfoError from '../errors/invalid-parse-info.error.js';

/**
 * Descarga un video desde la URL proporcionada usando una herramienta de línea de comandos.
 *
 * @async
 *
 * @param {string} url - La URL del video a descargar.
 * @param {string} outputDir - La ruta del directorio de salida.
 *
 * @returns {Promise<string>} Una promesa que se resuelve con la ruta del archivo del video descargado.
 *
 * @throws {Error} Si el proceso de descarga falla.
 */
async function download(url, outputDir) {
    return new Promise((resolve, reject) => {
        const command = [
            '-f', 'bestvideo*+bestaudio/best',
            '-P', outputDir,
            '-o', '%(id)s.%(ext)s',
            '--add-metadata',
            '--embed-thumbnail',
            '--print', 'after_move:filepath',
            url,
        ];

        execFile('yt-dlp', command, {encoding: 'utf-8'}, (error, stdout) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(stdout.toString().trim());
        });
    });
}

/**
 * Obtiene información sobre un video desde la URL proporcionada.
 *
 * @async
 *
 * @param {string} url
 *
 * @returns {Promise<{
 *  id: string,
 *  title: string,
 *  description: string,
 *  thumbnail: string,
 *  duration: number,
 *  extractor: string,
 *  extractor_key: string,
 * }>}
 */
async function info(url) {
    return new Promise((resolve, reject) => {
        const printOtions = [
            '"id":%(id|null)j',
            '"title":%(title|null)j',
            '"description":%(description|null)j',
            '"thumbnail":%(thumbnail|url|null)j',
            '"original_url":%(original_url|null)j',
            '"url":%(url|null)j',
            '"duration":%(duration|null)j',
            '"extractor":%(extractor|null)j',
            '"extractor_key":%(extractor_key|null)j',
            '"uploader":%(uploader|null)j',
            '"uploader_url":%(uploader_url|null)j',
        ].join(',');

        const command = [
            '--ignore-errors',
            '--print', `{${printOtions}}`,
            '--yes-playlist',
            '--skip-download',
            '--no-playlist-reverse',
            url
        ];

        execFile('yt-dlp', command, (error, stdout) => {
            if (error) {
                reject(error);

                return;
            }

            try {
                const outputs = stdout
                    .trim()
                    .split('\n')
                    .map((e) => JSON.parse(e));

                if (!outputs.length) {
                    reject(new EmptyInfoResponseError());

                    return;
                }

                resolve(outputs);
            } catch {
                reject(new InvalidParseInfoError());
            }
        });
    });
}

export { download, info };

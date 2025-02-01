import { exec } from "node:child_process";
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
export async function download(url, outputDir) {
    return new Promise((resolve, reject) => {
        const command = [
            'yt-dlp',
            '-f', 'bestvideo*+bestaudio/best',
            '-P', `"${outputDir}"`,
            '-o', '"%(id)s.%(ext)s"',
            '--add-metadata',
            '--embed-thumbnail',
            '--print', 'after_move:filepath',
            `"${url}"`,
        ].join(' ');

        exec(command, {encoding: 'utf-8'}, (error, stdout, stderr) => {
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
 *  artist: string,
 *  title: string,
 *  description: string,
 *  thumbnail: string,
 *  duration: number,
 *  extractor: string,
 *  extractor_key: string,
 *  filesize: number,
 *  ext: string,
 *  width: number,
 *  height: number,
 *  formats: object[]
 * }>}
 */
export async function info(url) {
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

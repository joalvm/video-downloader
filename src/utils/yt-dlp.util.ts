import { execFile } from "node:child_process";

import EmptyInfoResponseError from '@/errors/empty-info-response.error';
import InvalidParseInfoError from '@/errors/invalid-parse-info.error';

type VideoFormat = 'video' | 'audio' | 'video_audio';

interface VideoInfo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    original_url: string;
    url: string;
    duration: number;
    extractor: string;
    extractor_key: string;
    uploader: string;
    uploader_url: string;
}

/**
 * Descarga un video desde la URL proporcionada usando una herramienta de línea de comandos.
 *
 * @async
 *
 * @throws {Error} Si el proceso de descarga falla.
 */
async function download(url: string, outputDir: string, format: VideoFormat = 'video_audio'): Promise<string> {
    return new Promise((resolve, reject) => {
        const formats: Record<VideoFormat, string> = {
            video: 'bestvideo/best',
            audio: 'bestaudio/best',
            video_audio: 'bestvideo*+bestaudio/best',
        }

        const command = [
            '--no-check-certificates',
            '--age-limit', '99',
            '-f', formats[format],
            '-P', outputDir,
            '--restrict-filenames',
            '-o', '%(title|lower).40s__%(uploader|lower).15s__%(id)s.%(ext)s',
            '--add-metadata',
            '--print', 'after_move:filepath'
        ];

        // Opciones específicas para audio
        if (format === 'audio') {
            command.push(
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '0' // Máxima calidad
            );
        }

        if (['video', 'video_audio'].includes(format)) {
            command.push('--merge-output-format', 'mp4');
        }

        command.push(url); // La URL siempre al final

        execFile('yt-dlp', command, { encoding: 'utf-8' }, (error, stdout) => {
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
 */
async function info(url: string): Promise<VideoInfo[]> {
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
            '--no-check-certificates',
            '--age-limit', '99',
            '--ignore-errors',
            '--print', `{${printOtions}}`,
            '--yes-playlist',
            '--skip-download',
            '--no-playlist-reverse'
        ];

        command.push(url);

        execFile('yt-dlp', command, (error, stdout) => {
            if (error) {
                reject(error);

                return;
            }

            try {
                const outputs = stdout
                    .trim()
                    .split('\n')
                    .map((e) => JSON.parse(e) as VideoInfo);

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

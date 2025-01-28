import {Router} from 'express';
import {basename, join} from 'path';
import {Readable} from 'node:stream';
import {tmpdir} from 'node:os';

import InvalidOrMissingUrlError from '../errors/invalid-or-missing-url.error.js';
import { exec } from 'node:child_process';

const OUTPUT_DIR = join(tmpdir(), 'downloads');

const routes = Router();

routes.get('/proxy', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send('URL requerida');
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        Readable.fromWeb(response.body).pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al procesar la imagen');
    }
});

// Muestra información del video
routes.get('/info', (req, res) => {
    const {url} = req.query;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    exec(`yt-dlp --print-json --skip-download ${url}`, {encoding: 'utf-8'}, (error, stdout, stderr) => {
        if (error) {
            console.error('Error getting video info:', stderr);
            res.status(500).json({message: error.message || 'Failed to get video info'});

            return;
        }

        console.error('out: ', stdout);

        const content = JSON.parse(stdout?.toString()?.trim() || '');

        if (!content) {
            res.status(500).json({message: 'Failed to get video info'});

            return;
        }

        res.status(200).json(content);
    });
});

// Ruta para descargar un video
routes.post('/download', (req, res) => {
    const {url} = req.body;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    return download(url)
        .then((filepath) => {
            res.download(filepath, basename(filepath), (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                }
            });
        })
        .catch(() => {
            res.status(500).json({message: 'Failed to download video'});
        });
});

async function download(url) {
    return new Promise((resolve, reject) => {
        const command = [
            'yt-dlp',
            '-f', 'bestvideo*+bestaudio/best',
            '-P', `"${OUTPUT_DIR}"`,
            '-o', '"%(id)s.%(ext)s"',
            '--add-metadata',
            '--embed-thumbnail',
            '--print', 'after_move:filepath',
            url,
        ].join(' ');

        exec(command, {encoding: 'utf-8'}, (error, stdout, stderr) => {
            if (error) {
                console.error('Error downloading video:', stderr);
                reject(error);

                return;
            }

            resolve(stdout.toString().trim());
        });
    });
}

export default routes;

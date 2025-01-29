import {basename} from 'path';
import {join} from 'path';
import {tmpdir} from 'node:os';
import { exec } from 'node:child_process';
import InvalidOrMissingUrlError from '../errors/invalid-or-missing-url.error.js';

const OUTPUT_DIR = join(tmpdir(), 'downloads');

async function downloadHandler(req, res) {
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
}

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
                reject(error);

                return;
            }

            resolve(stdout.toString().trim());
        });
    });
}

export default downloadHandler;

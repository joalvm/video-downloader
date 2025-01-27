const {Router} = require('express');
const {execSync} = require('child_process');
const {basename, join} = require('path');
const {Readable} = require('node:stream');
const {tmpdir} = require('node:os');

const InvalidOrMissingUrlError = require('../errors/invalid-or-missing-url.error');

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

    try {
        const result = execSync(`yt-dlp --print-json ${url}`);

        res.json(JSON.parse(result.toString().trim()));
    } catch (error) {
        console.error('Error getting video info:', error);
        res.status(500).json({message: 'Failed to get video info'});
    }
});

// Ruta para descargar un video
routes.post('/download', (req, res) => {
    const {url} = req.body;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    try {
        const result = execSync(
            `yt-dlp -f bestvideo*+bestaudio/best -P "${OUTPUT_DIR}" -o "%(id)s.%(ext)s" --print after_move:filepath ${url}`,
        );

        const filepath = result.toString().trim();

        res.download(filepath, basename(filepath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({message: 'Failed to download video'});
    }
});

module.exports = routes;

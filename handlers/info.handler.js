import {exec} from 'child_process';
import InvalidOrMissingUrlError from "../errors/invalid-or-missing-url.error.js";

function infoHanlder(req, res) {
    const {url} = req.query;

    if (!url) {
        throw new InvalidOrMissingUrlError();
    }

    exec(`yt-dlp --print-json --skip-download ${url}`, {encoding: 'utf-8'}, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({message: error.message || 'Failed to get video info'});

            return;
        }

        const content = JSON.parse(stdout?.toString()?.trim() || '');

        if (!content) {
            res.status(500).json({message: 'Failed to get video info'});

            return;
        }

        res.status(200).json(content);
    });
}

export default infoHanlder;

import { Request, Response } from 'express';

/**
 * Home page handler.
 */
function homeHandler(_: Request, res: Response): void {
    res.render('index', { nonce: res.locals.nonce });
}

export default homeHandler;

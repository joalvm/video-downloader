import { Request, Response } from 'express';

class HomeController {
    index(_: Request, res: Response) {
        res.render('index', { nonce: res.locals.nonce });
    }
}

export default new HomeController();

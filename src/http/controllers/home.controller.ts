import { Response } from 'express';

class HomeController {
    index(res: Response) {
        res.render('index', { nonce: res.locals.nonce });
    }
}

export default new HomeController();

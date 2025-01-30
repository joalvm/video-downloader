/**
 * Home page handler.
 *
 * @param {import('express').Request<{}, {}, {}, {url?: string}>} _
 * @param {import('express').Response<void, {nonce: string}>} res
 *
 * @returns {void}
 */
function homeHandler(_, res) {
    res.render('index', {nonce: res.locals.nonce});
}

export default homeHandler;

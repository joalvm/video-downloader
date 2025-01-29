function homeHandler(req, res) {
    res.render('index', {nonce: res.locals.nonce});
}

export default homeHandler;

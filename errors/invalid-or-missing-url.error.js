const httpError = require('http-errors');

class InvalidOrMissingUrlError extends httpError.NotAcceptable {
    name = 'InvalidOrMissingError';

    constructor() {
        super('Invalid or missing URL');
    }
}

module.exports = InvalidOrMissingUrlError;

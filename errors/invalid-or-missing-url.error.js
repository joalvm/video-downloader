import httpError from 'http-errors';

class InvalidOrMissingUrlError extends httpError.NotAcceptable {
    name = 'InvalidOrMissingError';

    constructor() {
        super('Invalid or missing URL');
    }
}

export default InvalidOrMissingUrlError;

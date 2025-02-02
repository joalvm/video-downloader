import httpError from 'http-errors';

class InvalidOrMissingUrlError extends httpError.NotAcceptable {
    constructor() {
        super('Invalid or missing URL');

        this.name = 'InvalidOrMissingUrlError';
    }
}

export default InvalidOrMissingUrlError;

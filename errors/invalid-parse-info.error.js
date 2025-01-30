import httpError from 'http-errors';

class InvalidParseInfoError extends httpError.InternalServerError {
    name = 'InvalidParseInfoError';

    constructor() {
        super('Hubo un error al obtener la información del video, no se pudo parsear la información.');
    }
}

export default InvalidParseInfoError;

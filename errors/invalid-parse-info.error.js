import httpError from 'http-errors';

class InvalidParseInfoError extends httpError.InternalServerError {
    constructor() {
        super('Hubo un error al obtener la información del video, no se pudo parsear la información.');

        this.name = 'InvalidParseInfoError';
    }
}

export default InvalidParseInfoError;

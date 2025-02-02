import httpError from 'http-errors';

class EmptyInfoResponseError extends httpError.NotAcceptable {
    constructor() {
        super('Error al obtener la información del video, el contenido está vacío.');

        this.name = 'EmptyInfoResponseError';
    }
}

export default EmptyInfoResponseError;

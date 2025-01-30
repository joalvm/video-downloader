import httpError from 'http-errors';

class EmptyInfoResponseError extends httpError.NotAcceptable {
    name = 'EmptyInfoResponseError';

    constructor() {
        super('Error al obtener la información del video, el contenido está vacío.');
    }
}

export default EmptyInfoResponseError;

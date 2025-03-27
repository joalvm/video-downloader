/**
 * Normaliza el puerto en un número, cadena o false.
 */
function normalizePort(val: string | number): number | string | false {
    const port = parseInt(val.toString(), 10);

    if (isNaN(port)) {
        return val.toString();
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

export default normalizePort;

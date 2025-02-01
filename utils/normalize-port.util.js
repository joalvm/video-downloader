/**
 * Normaliza el puerto en un número, cadena o false.
 *
 * @param {any} val
 *
 * @returns {number | string | false}
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

export default normalizePort;

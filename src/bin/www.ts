#!/usr/bin/env node

import http from 'http';
import https from 'https';
import fs from 'fs';
import { tmpdir } from 'os';
import { AddressInfo } from 'net';

import winston from 'winston';

import app from '../app.js';
import normalizePort from '../utils/normalize-port.util.js';

// Configuración del puerto
const DEFAULT_PORT = 3000;
const port = normalizePort(process.env.APP_PORT || DEFAULT_PORT);

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

app.set('port', port);

// Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({
            level: 'error',   filename: 'combined.log',
            dirname: tmpdir() + '/logs'
        }),
    ],
});


// Crear servidor HTTP/HTTPS
const server = process.env.NODE_ENV === 'production'
    ? https.createServer({
        key: fs.readFileSync('/path/to/key.pem'),
        cert: fs.readFileSync('/path/to/cert.pem'),
    }, app)
    : http.createServer(app);


// Escuchar en el puerto
server.listen(port);

// Definir el tipo para error
type ErrnoException = Error & {
    code?: string;
    syscall?: string;
};

server.on('error', function (error: ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    if (error.code === 'EACCES') {
        logger.error(`${bind} requiere privilegios elevados.`);
        process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
        logger.error(`${bind} está en uso.`);
        process.exit(1);
    } else {
        throw error;
    }
});

server.on('listening', function () {
    const addr = server.address() as AddressInfo;
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

    logger.info(`Listening on ${bind}`);
});

// Captura de señales para cerrar el servidor
process.on('SIGINT', () => {
    logger.info('Cerrando servidor...');

    server.close(() => {
        logger.info('Servidor cerrado');

        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    logger.info('Servidor terminado');

    server.close(() => process.exit(0));
});

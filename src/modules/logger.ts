
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import process from 'process';

import config from '../config/index.js'

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ timestamp, level, message}) =>{
    return `[${timestamp}] [${level}] ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // label({ label: '|'}),
        logFormat,
    ),

    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
    // exceptionHandlers: [
    //     new winstonDaily({
    //         level: 'error',
    //         datePattern: 'YYYY-MM-DD',
    //         dirname: logDir,
    //         filename: `%DATE%.exception.log`,
    //         maxFiles: 30,
    //         zippedArchive: true,
    //     }),
    // ],
});

if( config.mode_env != 'SERVICE'){
    logger.add(
        new winston.transports.Console({
            level: 'silly',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    );
}

module.exports = logger;
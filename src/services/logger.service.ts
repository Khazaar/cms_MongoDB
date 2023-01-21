import winston, { format, level } from "winston";

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "CMSserver.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                myFormat
            ),
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

export = logger;

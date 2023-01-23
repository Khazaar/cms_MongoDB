import winston, { format, level } from "winston";

const consoleFormat = winston.format.printf(
    ({ level, message, timestamp, context }) => {
        return `${level}: ${message}  [${context}]`;
    }
);

const fileFormat = winston.format.printf(
    ({ level, message, timestamp, context }) => {
        return `${timestamp} ${level}: ${message}  [${context}]`;
    }
);

const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    defaultMeta: "",
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "CMSserver.log",
            format: winston.format.combine(
                winston.format.timestamp(),

                fileFormat
            ),
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                consoleFormat
            ),
        }),
    ],
});

export = logger;

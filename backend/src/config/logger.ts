import winston, { format } from "winston";

const { combine, timestamp, json } = format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "error.log", level: "error" })],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);

export const buildLogger = (service: string) => {
  return {
    log: (message: string, meta?: Record<string, unknown>) => {
      logger.info(message, { service, ...meta });
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
      logger.warn(message, { service, ...meta });
    },
    error: (message: string, meta?: Record<string, unknown>) => {
      logger.error(message, { service, ...meta });
    },
  };
};

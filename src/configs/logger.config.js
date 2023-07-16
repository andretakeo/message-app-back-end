import winston from "winston";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

import chalk from "chalk";

const modeLog = (mode) => {
  switch (mode) {
    case "development":
      return chalk.underline.yellowBright(mode);
    case "production":
      return chalk.underline.greenBright(mode);
    default:
      return chalk.underline.yellow(mode);
  }
};

export { logger, modeLog };

// To be used as logger.info(message) or logger.error(error)

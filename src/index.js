import dotenv from "dotenv";
import app from "./app.js";

import { logger, modeLog } from "./configs/logger.config.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Handling erros (uncaught exceptions and unhandled rejections)
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  process.exit(1);
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

let server;
server = app.listen(PORT, () => {
  logger.info(`Running in ${modeLog(process.env.NODE_ENV)} mode.`);
  logger.info(`Server running at port: ${PORT}`);
});

//SIGTERM to kill the server in the terminal.
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});

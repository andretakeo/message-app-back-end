import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app.js";
import { logger, modeLog } from "./configs/logger.config.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const { DATABASE_URL } = process.env;

// exit mongoose connection on error
mongoose.connection.on("error", (err) => {
  logger.error(`mongoose connection error: ${err}`);
  process.exit(1);
});

// exit mongoose connection on app termination
process.on("SIGINT", () => {
  logger.info("app is terminating");
  mongoose.connection.close(() => {
    logger.info("mongoose connection is disconnected");
    process.exit(0);
  });
});

// mongodb on debug mode
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

// Connecting to the database
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Database connected.");
  });

// Creating the server
let server;
server = app.listen(PORT, () => {
  logger.info(`Running in ${modeLog(process.env.NODE_ENV)} mode.`);
  logger.info(`Server running at port: ${PORT}`);
});

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

//SIGTERM to kill the server in the terminal.
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});

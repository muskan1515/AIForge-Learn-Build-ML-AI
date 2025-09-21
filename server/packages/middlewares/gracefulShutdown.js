const mongoose = require('mongoose');
const { logger } = require("../config/loggerConfig");

const gracefulShutdown = async (server, signal, err) => {
  try {
    logger.info(`Received signal: ${signal}, shutting down gracefully...`);

    if (server) {
      server.close(() => {
        logger.info("HTTP server closed");
      });
    }

    await mongoose.disconnect();
    logger.info("MongoDB disconnected");

    if (err) {
      logger.error(err);
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

const shutdownHandler = (server) => {
  process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
  process.on('uncaughtException', (err) => gracefulShutdown(server, 'uncaughtException', err));
  process.on('unhandledRejection', (err) => gracefulShutdown(server, 'unhandledRejection', err));
};

module.exports = { shutdownHandler };

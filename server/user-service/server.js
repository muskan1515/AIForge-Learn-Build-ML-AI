const { app } = require("./app");
const cluster = require("cluster");
const os = require("os");
const { config } = require("../packages/config/envConfig");
const { connectToDB } = require("./config/dbConfig");
const { logger } = require("../packages/config/loggerConfig");
const { shutdownHandler } = require("../packages/middlewares/gracefulShutdown");

if (cluster.isPrimary) {
  logger.info(`Master process is running on PID: ${process.pid}`);
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
    logger.info("Starting a new worker...");
    cluster.fork();
  });

} else {
  (async () => {
    try {
      await connectToDB();
      logger.info(`Worker ${process.pid} connected to MongoDB`);

      const server = app.listen(config.user_service.port, () => {
        logger.info(`Worker ${process.pid} running on port: ${config.learning_service.port}`);
      });

      shutdownHandler(server);
    } catch (err) {
      logger.error("Failed to connect DB", err);
      process.exit(1);
    }
  })();
}

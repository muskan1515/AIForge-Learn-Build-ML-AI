const { app } = require("./app");
const { connectToDB } = require("./config/dbConfig");
const { config } = require("./config/envConfig");
const { logger } = require("./config/loggerConfig");

const cluster = require("cluster");
const os = require("os");

//check if its the master process
if (cluster.isPrimary) {
  logger.info(`Master process is running on this ${process.pid}`);
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("close", () => {
    logger.error(`Worker ${worker.process.pid} died`);
    logger.info("Starting a new worker...");
    cluster.fork();
  });
  
} else {
  app.listen(config.port, async () => {
    await connectToDB();
    logger.info(`Server running on this port: ${config.port}`);
  });
}

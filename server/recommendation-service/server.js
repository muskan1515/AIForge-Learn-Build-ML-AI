// server.js
const { config } = require("../packages/config/envConfig");
const { createTopic } = require("../packages/config/kafka/admin");
const { app } = require("./app");
const { connectToDB } = require("./config/dbConfig");
const { startConsumer } = require("./consumers/recommendationConsumer");

const start = async () => {
  // connect DB
  await connectToDB();
  await createTopic();

  // start Kafka consumer (in prod you'd guard errors/retries)
  try {
    await startConsumer();
  } catch (err) {
    console.warn("Kafka consumer failed to start:", err.message);
    // depending on design you may exit the process or continue without consumer
  }

  const server = app.listen(config.recommendation_service.port, () => {
    console.info(
      `Recommendation service listening on ${config.recommendation_service.port}`
    );
  });

  const shutdown = async () => {
    console.info("Shutting down...");
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

start().catch((err) => {
  console.error("Failed to start service:", err);
  process.exit(1);
});

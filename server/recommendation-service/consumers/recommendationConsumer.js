// src/consumers/recommendationConsumer.js
const { config } = require("../../packages/config/envConfig");
const kafka = require("../../packages/config/kafka/kafkaConfig");
const recommendationService = require("../services/recommendationService");

/**
 * Start the Kafka consumer and listen to the recommendation topic.
 * This keeps processing messages and uses recommendationService to update DB.
 */
const startConsumer = async () => {
  const consumer = kafka.consumer();
  await consumer.connect();
  await consumer.subscribe({
    topic: config.recommendation_service.topic,
    fromBeginning: false,
  });

  console.info(
    "✅ Kafka consumer connected and subscribed to",
    config.recommendation_service.topic
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const raw = message.value.toString();
        let payload;
        try {
          payload = JSON.parse(raw);
        } catch (e) {
          console.warn("Invalid JSON message, skipping:", raw);
          return;
        }
        // Basic validation
        if (!payload || !payload.userId || !payload.contentId) {
          console.warn("Skipping incomplete message:", payload);
          return;
        }

        // call service (simple merge logic)
        await recommendationService.handleInteraction({
          userId: payload.userId,
          contentId: payload.contentId,
          interactionSign: payload.interactionSign || 1,
        });
      } catch (err) {
        console.error("Error handling message:", err);
        // In a professional setup you'd push the message to DLQ or retry logic
      }
    },
  });

  return consumer;
};

module.exports = { startConsumer };

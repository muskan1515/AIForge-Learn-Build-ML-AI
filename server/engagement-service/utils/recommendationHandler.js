// src/events/kafkaPublisher.js
const kafka = require("../../packages/config/kafka/kafkaConfig");
const producer = kafka.producer();

let isConnected = false;

/**
 * Initializes the Kafka producer (call once at app startup)
 */
const initKafkaProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("✅ Kafka Producer Connected");
  }
};

/**
 * Publishes a user interaction event to Kafka
 * @param {Object} payload
 * @param {string} payload.userId - ID of the user performing the action
 * @param {string} payload.contentId - ID of the content interacted with
 * @param {string} payload.interactionType - Type of interaction ('liked', 'saved', etc.)
 */
const publishUserInteractionToKafka = async (payload) => {
  try {
    if (!isConnected) await initKafkaProducer();

    await producer.send({
      topic: "update-content-recommendation",
      messages: [
        {
          key: payload.userId,
          value: JSON.stringify(payload),
        },
      ],
    });

    console.log(`📤 Sent interaction event for user ${payload.userId}`);
  } catch (err) {
    console.error("❌ Kafka publish error:", err.message);
    throw err;
  }
};

/**
 * Gracefully disconnect Kafka producer
 */
const shutdownKafka = async () => {
  if (isConnected) {
    await producer.disconnect();
    console.log("🔌 Kafka Producer Disconnected");
    isConnected = false;
  }
};

module.exports = {
  initKafkaProducer,
  publishUserInteractionToKafka,
  shutdownKafka,
};

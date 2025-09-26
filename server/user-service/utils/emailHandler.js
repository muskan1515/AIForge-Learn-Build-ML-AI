// emailProducer.js
const { config } = require("../../packages/config/envConfig");
const {
  connectRabbitMQ,
  publishMessage,
} = require("../../packages/config/rabbitMQConfig");

let channel;

/**
 * Initialize RabbitMQ connection & channel for email queue
 */
const initEmailQueue = async () => {
  if (!channel) {
    const { channel: ch } = await connectRabbitMQ(config.rabbitmq.URL);
    channel = ch;
  }
  return channel;
};

/**
 * Send email payload to RabbitMQ email queue
 * @param {Object} payload - Email payload (to, subject, body, etc.)
 */
const sendEmail = async (payload) => {
  try {
    if (!channel) {
      await initEmailQueue();
    }

    await publishMessage("email-queue", payload);
    console.log("📧 Email task queued:", payload);

    return true;
  } catch (err) {
    console.error("❌ Failed to queue email:", err.message);
    throw err;
  }
};

module.exports = { initEmailQueue, sendEmail };

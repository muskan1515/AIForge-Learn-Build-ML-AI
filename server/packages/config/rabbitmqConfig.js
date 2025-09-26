const amqp = require("amqplib");
const { config } = require("./envConfig");

let connection;
let channel;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Connect with auto-retry and confirm channel
 */
const connectRabbitMQ = async (url) => {
  if (connection && channel) return { connection, channel };

  let retries = 0;
  const maxRetries = parseInt(config.rabbitmq.MAX_RETRIES, 10);

  while (retries <= maxRetries) {
    try {
      connection = await amqp.connect(url);

      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err.message);
        connection = null;
        channel = null;
      });

      connection.on("close", () => {
        console.warn("RabbitMQ connection closed. Reconnecting...");
        connection = null;
        channel = null;
      });

      channel = await connection.createConfirmChannel(); // confirm channel
      console.log("✅ Connected to RabbitMQ with confirm channel");
      return { connection, channel };
    } catch (err) {
      retries++;
      const backoff = Math.min(1000 * 2 ** retries, 30000);
      console.error(
        `❌ Connection failed (attempt ${retries}). Retrying in ${
          backoff / 1000
        }s`
      );
      if (retries > maxRetries) throw err;
      await delay(backoff);
    }
  }
};

/**
 * Publish with confirm + retry + DLQ support
 */
const publishMessage = async (queue, message) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  const maxRetries = parseInt(process.env.RABBITMQ_MAX_RETRIES || "5", 10);
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      await channel.assertQueue(queue, {
        durable: true,
        deadLetterExchange: "",
        deadLetterRoutingKey: `${queue}.dlq`, // DLQ binding
      });

      await new Promise((resolve, reject) => {
        channel.sendToQueue(
          queue,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          },
          (err, ok) => {
            if (err) reject(err);
            else resolve(ok);
          }
        );
      });

      console.log(`📩 Published to "${queue}":`, message);
      return;
    } catch (err) {
      attempt++;
      const backoff = Math.min(1000 * 2 ** attempt, 30000);
      console.error(
        `❌ Publish failed (attempt ${attempt}). Retrying in ${backoff / 1000}s`
      );

      if (attempt > maxRetries) {
        console.error("🚨 Max retries reached. Sending to DLQ.");
        await channel.assertQueue(`${queue}.dlq`, { durable: true });
        channel.sendToQueue(
          `${queue}.dlq`,
          Buffer.from(JSON.stringify(message))
        );
        return;
      }
      await delay(backoff);
    }
  }
};

/**
 * Consume with ack/nack + DLQ support
 */
const consumeMessage = async (queue, callback) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: `${queue}.dlq`,
  });

  await channel.assertQueue(`${queue}.dlq`, { durable: true });

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const content = msg.content.toString();
    try {
      await callback(JSON.parse(content));
      channel.ack(msg);
    } catch (err) {
      console.error("❌ Processing error:", err.message);

      // retry or DLQ
      const retries = msg.properties.headers["x-retries"] || 0;
      if (retries < (process.env.CONSUMER_MAX_RETRIES || 3)) {
        channel.nack(msg, false, true); // requeue for retry
        msg.properties.headers["x-retries"] = retries + 1;
      } else {
        console.warn("🚨 Max consumer retries reached. Sending to DLQ.");
        channel.sendToQueue(`${queue}.dlq`, msg.content);
        channel.ack(msg);
      }
    }
  });

  console.log(`👂 Listening on queue "${queue}"`);
};

module.exports = {
  connectRabbitMQ,
  publishMessage,
  consumeMessage,
};

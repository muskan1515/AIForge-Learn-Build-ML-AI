const nodemailer = require("nodemailer");
const { config } = require("../../packages/config/envConfig");
const {
  connectRabbitMQ,
  consumeMessage,
} = require("../../packages/config/rabbitMQConfig");

// Nodemailer transporter (SMTP)
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure || false,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/**
 * Send an email
 * @param {Object} payload
 * @param {string} payload.to - recipient email
 * @param {string} payload.subject - subject
 * @param {string} payload.body - plain text message
 */
const sendMail = async ({ to, subject, body }) => {
  try {
    const mailOptions = {
      from: config.smtp.from || `"No Reply" <${config.smtp.user}>`,
      to,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err; // let consumer retry with backoff
  }
};

/**
 * Start the email consumer service
 */
const startEmailService = async () => {
  try {
    await connectRabbitMQ(config.rabbitmq.URL);

    await consumeMessage("email-queue", async (message) => {
      await sendMail(message);
    });

    console.log("📬 Email Service is running and listening for jobs...");
  } catch (err) {
    console.error("❌ Failed to start Email Service:", err);
    process.exit(1);
  }
};

module.exports = { startEmailService };

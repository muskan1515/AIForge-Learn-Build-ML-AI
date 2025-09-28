const dotenv = require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  origins: ["http://localhost:3000"] || [],
  mongodb_uri:
    process.env.MONGODB_URI ||
    "mongodb+srv://muskankushwah85:Muskan15@cluster0.mxnxlvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: process.env.CLIENT_URL || "",
  winston: {
    level: process.env.LEVEL || "info",
  },
  redis: {
    client: process.env.redis_client || "127.0.0.1",
  },
  learning_service: {
    port: process.env.LEARNING_SERVICE_PORT || 5001,
  },
  user_service: {
    port: process.env.USER_SERVICE_PORT || 5002,
  },
  engagement_service: {
    port: process.env.ENGAGEMENT_SERVICE_PORT || 5003,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET || "accesstoken",
      expiresIn: process.env.ACCESS_EXPIRE_IN || "15m",
      expiresInMs: process.env.ACCESS_EXPIRE_IN_MICRO_SECS || 900,
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET || "refreshtoken",
      expiresIn: process.env.REFRESH_EXPIRE_IN || "15d",
      expiresInMs: process.env.REFRESH_EXPIRE_IN_MICRO_SECS || 1296000,
    },
  },
  rabbitmq: {
    URL: process.env.RABBITMQ_URL || "",
    MAX_RETRIES: process.env.RABBITMQ_MAX_RETRIES || 3,
  },
  smtp: {
    port: process.env.PORT,
    host: process.env.HOST || "",
    secure: process.env.SECURE || false,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

module.exports = { config };

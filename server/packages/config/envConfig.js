const dotenv = require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  origins: ["http://localhost:3000"] || [],
  mongodb_uri:
    process.env.MONGODB_URI ||
    "mongodb+srv://muskankushwah85:Muskan15@cluster0.mxnxlvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  NODE_ENV: process.env.NODE_ENV || "development",
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
};

module.exports = { config };

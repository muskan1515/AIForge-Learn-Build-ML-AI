const dotenv = require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  origins: ["http://localhost:3000"] || [],
  mongodb_uri: process.env.MONGODB_URI || 'mongodb+srv://muskankushwah85:Muskan15@cluster0.mxnxlvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  winston: {
    "level": process.env.LEVEL || 'info'
  },
  redis: {
    client: process.env.redis_client || '127.0.0.1',
  },
  "learning_service": {
    port: process.env.LEARNING_SERVICE_PORT || 5001,
  },
};

module.exports = { config };

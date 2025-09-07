const dotenv = require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  origins: ["http://localhost:3000"] || [],
  mongodb_uri: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = { config };

const mongoose = require("mongoose");
const { config } = require("../../packages/config/envConfig");
const { logger } = require("../../packages/config/loggerConfig");

const connectToDB = async () => {
  try {
    await mongoose.connect(config.mongodb_uri);
    logger.info("Successfully connected to the MongoDB");
  } catch (err) {
    console.error("Got error while connecting to db:", err);
    logger.error(err);
  }
};

module.exports = { connectToDB };

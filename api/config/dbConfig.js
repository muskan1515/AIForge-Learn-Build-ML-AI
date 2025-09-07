const mongoose = require("mongoose");
const { config } = require("./envConfig");
const { logger } = require("./loggerConfig");

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

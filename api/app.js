const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { config } = require("./config/envConfig");

const app = express();
app.use(
  cors({
    origin: config.origins,
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS", "PUT"],
    allowedHeaders: ["*"],
    maxAge: 5000,
  })
);

if (config.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

module.exports = { app };

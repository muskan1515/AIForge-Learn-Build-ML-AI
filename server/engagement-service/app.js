const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet")

const { config } = require("../packages/config/envConfig");
const interactionRoutes = require("./routes/interactionRoutes");

const app = express();
app.use(
  cors({
    origin: ["*"], //config.origins,
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS", "PUT"],
    allowedHeaders: ["*"],
    maxAge: 5000,
  })
);

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

if (config.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(helmet())

app.use("/health", (req, res) => {
  return res.status(200).send({
    success: true,
    message: "Server is up and running"
  })
})

app.use("/apis/interaction", interactionRoutes)

module.exports = { app };

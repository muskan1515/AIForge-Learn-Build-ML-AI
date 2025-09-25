const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { config } = require("../packages/config/envConfig");
const learningContentRoutes = require("./routes/learningContent");

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

app.use("/health", (req, res) => {
  return res.status(200).send({
    success: true,
    message: "Server is up and running"
  })
})

app.use("/apis/learning-content", learningContentRoutes)

module.exports = { app };

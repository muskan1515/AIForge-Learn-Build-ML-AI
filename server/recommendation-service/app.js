// src/app.js
const express = require("express");
const recommendationRoutes = require("./routes/recommendationRoute");

const app = express();
app.use(express.json());

// Basic health
app.get("/health", (req, res) =>
  res.json({
    success: true,
    message: "Recommendation server is up and running",
  })
);

app.use("/apis/recommendations", recommendationRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not found" })
);

module.exports = { app };

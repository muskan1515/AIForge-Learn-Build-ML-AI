// src/models/UserRecommendation.js
const mongoose = require("mongoose");

/**
 * Per-user recommendations model
 * Stores a list of content suggestions and a simple score
 */
const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recommendations: [
      {
        contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
        score: { type: Number, required: true, default: 0 },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

recommendationSchema.index({ userId: 1 }, { unique: true });

const UserRecommendation = mongoose.model(
  "UserRecommendation",
  recommendationSchema
);

module.exports = UserRecommendation;

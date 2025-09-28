/**
 * @file UserContentInteraction.js
 * @description Mongoose model for storing user-content interactions such as likes or saves.
 */

const mongoose = require('mongoose');

const UserContentInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Content',
    },
    actionType: {
      type: String,
      enum: ['like', 'save', 'share'],
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Ensure unique combination of userId, contentId, and actionType
UserContentInteractionSchema.index({ userId: 1, contentId: 1, actionType: 1 }, { unique: true });

module.exports = mongoose.model('UserContentInteraction', UserContentInteractionSchema);

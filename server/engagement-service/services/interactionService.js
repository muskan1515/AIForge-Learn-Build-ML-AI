/**
 * @file interactionService.js
 * @description Contains business logic for handling user-content interactions.
 */

const UserContentInteraction = require("../models/UserContentInteraction");
const {
  publishUserInteractionToKafka,
} = require("../utils/recommendationHandler");

/**
 * Add or update a user-content interaction.
 * @param {Object} data - Interaction data (userId, contentId, actionType)
 * @returns {Promise<Object>} The created or updated interaction
 */
async function addInteraction(data) {
  const { userId, contentId, actionType } = data;
  const response = await UserContentInteraction.findOneAndUpdate(
    { userId, contentId, actionType },
    { userId, contentId, actionType },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await publishUserInteractionToKafka({
    userId,
    contentId,
    interactionType: actionType,
  });
  return response;
}

/**
 * Remove an existing interaction.
 * @param {String} userId - User ID
 * @param {String} contentId - Content ID
 * @param {String} actionType - Type of interaction
 * @returns {Promise<Boolean>} True if deleted, false otherwise
 */
async function removeInteraction(userId, contentId, actionType) {
  const result = await UserContentInteraction.findOneAndDelete({
    userId,
    contentId,
    actionType,
  });

  await publishUserInteractionToKafka({
    userId,
    contentId,
    interactionType: "removed",
  });

  return !!result;
}

/**
 * Get all interactions of a user.
 * @param {String} userId - User ID
 * @returns {Promise<Array>} List of interactions
 */
async function getUserInteractions(userId) {
  return await UserContentInteraction.find({ userId });
}

/**
 * Get all users who interacted with a specific content.
 * @param {String} contentId - Content ID
 * @returns {Promise<Array>} List of user interactions
 */
async function getContentInteractions(contentId) {
  return await UserContentInteraction.find({ contentId });
}

module.exports = {
  addInteraction,
  removeInteraction,
  getUserInteractions,
  getContentInteractions,
};

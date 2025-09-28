/**
 * @file interactionController.js
 * @description Express controller functions for user-content interactions.
 */

const interactionService = require('../services/interactionService');

/**
 * Add or update interaction.
 */
exports.addInteraction = async (req, res) => {
  try {
    const { userId, contentId, actionType } = req.body;
    const interaction = await interactionService.addInteraction({ userId, contentId, actionType });
    res.status(201).json({ success: true, data: interaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Remove an interaction.
 */
exports.removeInteraction = async (req, res) => {
  try {
    const { userId, contentId, actionType } = req.body;
    const removed = await interactionService.removeInteraction(userId, contentId, actionType);
    res.status(removed ? 200 : 404).json({
      success: removed,
      message: removed ? 'Interaction removed' : 'Interaction not found',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all interactions for a user.
 */
exports.getUserInteractions = async (req, res) => {
  try {
    const { userId } = req.params;
    const interactions = await interactionService.getUserInteractions(userId);
    res.json({ success: true, data: interactions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all users who interacted with a specific content.
 */
exports.getContentInteractions = async (req, res) => {
  try {
    const { contentId } = req.params;
    const interactions = await interactionService.getContentInteractions(contentId);
    res.json({ success: true, data: interactions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

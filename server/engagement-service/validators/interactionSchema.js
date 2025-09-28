/**
 * @file userContentSchema.js
 * @description Joi validation schemas for user-content interactions
 */

const Joi = require("joi");

/**
 * Schema for creating/toggling an interaction
 */
const createInteractionSchema = Joi.object({
  userId: Joi.string().required().hex().length(24).messages({
    "string.empty": "userId is required",
    "string.hex": "userId must be a valid ObjectId",
  }),
  contentId: Joi.string().required().hex().length(24).messages({
    "string.empty": "contentId is required",
    "string.hex": "contentId must be a valid ObjectId",
  }),
  interactionType: Joi.string()
    .valid("liked", "saved")
    .required()
    .messages({
      "any.only": "interactionType must be either 'liked' or 'saved'",
    }),
});

/**
 * Schema for fetching all interactions of a user
 */
const getUserInteractionsSchema = Joi.object({
  userId: Joi.string().required().hex().length(24),
});

/**
 * Schema for fetching a specific interaction
 */
const getInteractionSchema = Joi.object({
  userId: Joi.string().required().hex().length(24),
  contentId: Joi.string().required().hex().length(24),
});

module.exports = {
  createInteractionSchema,
  getUserInteractionsSchema,
  getInteractionSchema,
};

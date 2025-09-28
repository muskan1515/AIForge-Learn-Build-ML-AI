/**
 * @file interactionRoutes.js
 * @description Defines routes for user-content interactions.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/interactionController');

// POST: Add or update interaction
router.post('/', controller.addInteraction);

// DELETE: Remove interaction
router.delete('/', controller.removeInteraction);

// GET: Get all interactions by user
router.get('/user/:userId', controller.getUserInteractions);

// GET: Get all interactions for content
router.get('/content/:contentId', controller.getContentInteractions);

module.exports = router;

// src/controllers/recommendationController.js
const recommendationService = require("../services/recommendationService");

/**
 * POST /apis/recommendations/upsert
 * Body: { userId: string, items: [{contentId, delta}] }
 */
const upsert = async (req, res) => {
  try {
    const { userId, items } = req.body;
    const result = await recommendationService.upsertRecommendations(
      userId,
      items
    );
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /apis/recommendations/:userId?limit=10
 */
const getForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Number(req.query.limit || 10);
    const recs = await recommendationService.getRecommendations(userId, limit);
    return res.status(200).json({ success: true, data: recs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { upsert, getForUser };

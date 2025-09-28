// src/services/recommendationService.js
const UserRecommendation = require("../models/UserRecommendation");

/**
 * Very simple upsert that merges and updates scores.
 * Replace with your ML/CF logic later.
 *
 * @param {string} userId
 * @param {Array<{contentId: string, delta: number}>} items
 * @returns {Promise<Object>} updated document
 */
const upsertRecommendations = async (userId, items = []) => {
  const doc = await UserRecommendation.findOne({ userId });

  if (!doc) {
    const recommendations = items.map((i) => ({
      contentId: i.contentId,
      score: i.delta,
    }));
    return UserRecommendation.create({ userId, recommendations });
  }

  // merge scores
  const map = new Map(
    doc.recommendations.map((r) => [String(r.contentId), r.score])
  );
  for (const it of items) {
    const key = String(it.contentId);
    map.set(key, (map.get(key) || 0) + (it.delta || 0));
  }

  const merged = [...map.entries()]
    .map(([contentId, score]) => ({ contentId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 100); // limit to top 100

  doc.recommendations = merged;
  doc.updatedAt = Date.now();
  await doc.save();
  return doc.toObject();
};

/**
 * Get recommendations for a user
 * @param {string} userId
 * @param {number} limit
 */
const getRecommendations = async (userId, limit = 10) => {
  const doc = await UserRecommendation.findOne({ userId }).lean();
  if (!doc) return [];
  return doc.recommendations.slice(0, limit);
};

/**
 * Handle an incoming interaction event (simple logic).
 * Example payload: { userId, contentId, interactionSign }
 * Where interactionSign is +1 for view/like, -1 for dislike, etc.
 */
const handleInteraction = async (payload) => {
  const { userId, contentId, interactionSign } = payload;
  // Convert to array so that upsert logic can remain consistent
  return upsertRecommendations(userId, [
    { contentId, delta: Number(interactionSign || 1) },
  ]);
};

module.exports = {
  upsertRecommendations,
  getRecommendations,
  handleInteraction,
};

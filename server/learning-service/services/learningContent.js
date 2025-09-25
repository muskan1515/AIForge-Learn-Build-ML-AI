const redisClient = require("../../packages/config/redisClientConfig");
const LearningContent = require("../models/LearningContent");

/**
 * Add a new Learning Content
 * @param {Object} data - Learning Content Object
 * @returns {LearningContent}
 */
const addContent = async (data) => {
  try {
    const learningContent = new LearningContent(data);

    // Invalidate "all contents" cache
    await redisClient.del("all_learning_contents");

    return learningContent.toObject();
  } catch (err) {
    throw err;
  }
};

/**
 * Bulk Add Learning Contents
 * @param {Array} dataArray - Array of Learning Content Objects
 * @returns {LearningContent[]}
 */
const bulkAddContent = async (dataArray) => {
  try {
    const allContents = await LearningContent.insertMany(dataArray);

    // Invalidate "all contents" cache
    await redisClient.del("all_learning_contents");

    return allContents.map((doc) => doc.toObject());
  } catch (err) {
    throw err;
  }
};

/**
 * Get Specific Learning Content
 * @param {string} learningContentId
 * @returns {LearningContent}
 */
const getSpecificContent = async (learningContentId) => {
  try {
    const cached = await redisClient.get(`learning_content_${learningContentId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const specificContent = await LearningContent.findOne({ _id: learningContentId }).lean();

    // Cache for 60 seconds
    await redisClient.setex(
      `learning_content_${learningContentId}`,
      60,
      JSON.stringify(specificContent)
    );

    return specificContent;
  } catch (err) {
    throw err;
  }
};

/**
 * Get All Learning Contents
 * @returns {LearningContent[]}
 */
const getAllContent = async () => {
  try {
    const cached = await redisClient.get("all_learning_contents");
    if (cached) {
      return JSON.parse(cached);
    }

    const allContents = await LearningContent.find().lean();

    // Cache for 60 seconds
    await redisClient.setex(
      "all_learning_contents",
      60,
      JSON.stringify(allContents)
    );

    return allContents;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Learning Content
 * @param {string} contentId
 * @returns {LearningContent|null}
 */
const deleteContent = async (contentId) => {
  try {
    const deleted = await LearningContent.findByIdAndDelete(contentId);

    // Invalidate cache
    await redisClient.del(`learning_content_${contentId}`);
    await redisClient.del("all_learning_contents");

    return deleted ? deleted.toObject() : null;
  } catch (err) {
    throw err;
  }
};

/**
 * Update Learning Content
 * @param {string} contentId
 * @param {Object} data - Updated content
 * @returns {LearningContent}
 */
const updateContent = async (contentId, data) => {
  try {
    const updated = await LearningContent.findOneAndUpdate({ _id: contentId }, data, { new: true });

    // Invalidate cache
    await redisClient.del(`learning_content_${contentId}`);
    await redisClient.del("all_learning_contents");

    return updated ? updated.toObject() : null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addContent,
  bulkAddContent,
  getSpecificContent,
  getAllContent,
  deleteContent,
  updateContent,
};

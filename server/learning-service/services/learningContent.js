const LearningContent = require("../models/LearningContent");

/**
 * Add
 * @param {  } data - Learning Content Object
 * @returns {LearningContent}
 */
const addContent = async (data) => {
    try {
        return await LearningContent.create(data);
    } catch (err) {
        throw err;
    }
};

/**
 * Bulk Add
 * @param {} dataArray - Learning Content Object Array
 * @returns {LearningContent[]}
 */
const bulkAddContent = async (dataArray) => {
    try {
        return await LearningContent.insertMany(dataArray);
    } catch (err) {
        throw err;
    }
};

/**
 * Get Specific Content
 * @param {string} learningContentId 
 * @returns {LearningContent}
 */
const getSpecificContent = async (learningContentId) => {
    try {
        return await LearningContent.findById(learningContentId);
    } catch (err) {
        throw err;
    }
};


/**
 * Get All Content
 * @returns {LearningContent[]}
 */
const getAllContent = async () => {
    try {
        return await LearningContent.find();
    } catch (err) {
        throw err;
    }
};

/**
 * Delete
 * @param {string} contentId 
 * @returns {null}
 */
const deleteContent = async (contentId) => {
    try {
        return await LearningContent.findByIdAndDelete(contentId);
    } catch (err) {
        throw err;
    }
};

/**
 * Update
 * @param {string, LearningContent} - contentId, data
 * @returns {LearningContent}
 */
const updateContent = async (contentId, data) => {
    try {
        return await LearningContent.findByIdAndUpdate(contentId, data, { new: true });
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

const { addContent, bulkAddContent, getSpecificContent, getAllContent, deleteContent, updateContent } = require("../services/learningContent");

/**
 * @async
 * @function add
 * @param {import('express').Request} req - Express request object, expected to contain the learning content in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 201 Created: If the content was successfully added.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const add = async (req, res) => {
    try {
        const body = req.body;

        const learningContent = await addContent(body)

        res.status(201).send({
            success: true,
            message: "Successfully Created the Learning Content",
            learningContent
        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

/**
 * @async
 * @function bulk add
 * @param {import('express').Request} req - Express request object, expected to contain the learning content lists in `req.body`.
 * @param {import('express').Response[]} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 201 Created: If the content list was successfully added.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const bulkAdd = async (req, res) => {
    try {
        const body = req.body;

        const contentList = await bulkAddContent(body)

        res.status(201).send({
            success: true,
            message: "Successfully Created the Learning Content",
            contentList
        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

/**
 * @async
 * @function get
 * @param {import('express').Request} req - Express request object, expected to contain the learningContentId in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200 OK: If the contentId found successfully.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const get = async (req, res) => {
    try {

        const learningContentId = req.params.id

        const learningContent = await getSpecificContent(learningContentId)

        if (!learningContent) {
            return res.status(404).send({
                success: false,
                message: "No Learning Content found by this Id.",
                learningContent: null
            })
        }

        res.status(200).send({
            success: true,
            message: "Successfully Fetched the Learning Content",
            learningContent
        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

/**
 * @async
 * @function getAll
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response[]} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200 OK: If the content List found successfully.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const getAll = async (req, res) => {
    try {
        const contentList = await getAllContent()

        if (!contentList.length) {
            return res.status(404).send({
                success: false,
                message: "No Learning Content .",
                contentList: []
            })
        }

        res.status(200).send({
            success: true,
            message: "Successfully Fetched all the Learning Content",
            contentList
        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: "Internal Server Error" })
    }
}

/**
 * @async
 * @function delete
 * @param {import('express').Request} req - Express request object, expected to contain the learningContentId in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200 OK: If the content List found and deleted successfully.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const deleteSingle = async (req, res) => {
    try {

        const contentId = req.params.id;

        const isExisting = await getSpecificContent(contentId)
        if (!isExisting) {
            return res.status(404).send({ success: false, message: "No Learning Content found with this Id" })
        }

        await deleteContent(contentId)

        res.status(200).send({
            success: true,
            message: "Successfully deleted the Learning Content",

        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message || "Internal Server Error" })
    }
}


/**
 * @async
 * @function update
 * @param {import('express').Request} req - Express request object, expected to contain the learningContentId in `req.params` & content in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response:
 * - 200 OK: If the content List found and updated successfully.
 * - 500 Internal Server Error: If an error occurred while processing.
 */
const update = async (req, res) => {
    try {
        const contentId = req.params.id;
        const data = req.body;

        const isExisting = await getSpecificContent(contentId)
        if (!isExisting) {
            return res.status(404).send({ success: false, message: "No Learning Content found with this Id" })
        }

        const learningContent = await updateContent(contentId, data)

        res.status(200).send({
            success: true,
            message: "Successfully Updated the Learning Content",
            learningContent
        })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message || "Internal Server Error" })
    }
}

module.exports = {
    get,
    getAll,
    add,
    bulkAdd,
    deleteSingle,
    update
}
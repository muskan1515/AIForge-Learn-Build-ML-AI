const joi = require('joi')

const addSchema = joi.object({
    main_topic: joi.string().required(),
    sub_topic: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required().max(500),
    thumbnail_image: joi.string().optional().allow(""),
    main_content: joi.string().required(),
    video_links: joi.array().items(joi.string()).optional(),
    examples: joi.array().items(joi.object({
        text: joi.string().required(),
        link: joi.string().optional().allow("")
    })).optional(),
})

const bulkAddSchema = joi.array().items(addSchema)

const getSpecificSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

const deleteSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

const updateIdSchema = joi.object({
    id: joi.string().hex().length(24).required()
})

const updateBodySchema = joi.object({
    main_topic: joi.string().required(),
    sub_topic: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required().max(500),
    thumbnail_image: joi.string().optional().allow(""),
    main_content: joi.string().required(),
    video_links: joi.array().items(joi.string()).optional(),
    examples: joi.array().items(joi.object({
        text: joi.string().required(),
        link: joi.string().optional().allow("")
    })).optional(),
})

module.exports = {
    addSchema,
    deleteSchema,
    bulkAddSchema,
    getSpecificSchema,
    updateIdSchema,
    updateBodySchema
}
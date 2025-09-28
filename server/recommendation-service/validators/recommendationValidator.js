// src/validators/recommendationValidators.js
const Joi = require("joi");

/**
 * Validate middleware factory
 */
const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation error",
          details: error.details.map((d) => d.message),
        });
    }
    req[source] = value;
    next();
  };

const upsertSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        contentId: Joi.string().required(),
        delta: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

const getSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = {
  validateUpsert: validate(upsertSchema, "body"),
  validateGet: validate(getSchema, "params"),
};

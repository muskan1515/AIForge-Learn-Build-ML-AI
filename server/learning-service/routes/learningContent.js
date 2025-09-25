const express = require('express');
const { bulkAdd, add, get, getAll, update, deleteSingle } = require('../controllers/learningContent');
const rateLimiter = require('../middlewares/rateLimiter');
const throttler = require('../middlewares/throttler');
const validate = require('../middlewares/validate');
const {
  bulkAddSchema,
  addSchema,
  getSpecificSchema,
  deleteSchema,
  updateIdSchema,
  updateBodySchema
} = require('../validators/learningContent');

const router = express.Router();

router.post("/bulk", rateLimiter, validate('body', bulkAddSchema), bulkAdd);

router.post("/", rateLimiter, validate('body', addSchema), add);

router.get("/:id", throttler, validate('params', getSpecificSchema), get);

router.get("/", throttler, getAll);

router.put(
  "/:id",
  rateLimiter,
  validate('params', updateIdSchema),
  validate('body', updateBodySchema),
  update
);

router.delete("/:id", rateLimiter, validate('params', deleteSchema), deleteSingle);

module.exports = router;

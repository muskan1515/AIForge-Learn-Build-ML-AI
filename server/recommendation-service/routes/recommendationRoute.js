// src/routes/recommendationRoutes.js
const express = require("express");
const {
  upsert,
  getForUser,
} = require("../controllers/recommendationController");
const {
  validateUpsert,
  validateGet,
} = require("../validators/recommendationValidators");

const router = express.Router();

router.post("/upsert", validateUpsert, upsert);
router.get("/:userId", validateGet, getForUser);

module.exports = router;

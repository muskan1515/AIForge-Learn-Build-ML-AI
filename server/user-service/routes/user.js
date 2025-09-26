const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const rateLimiter = require("../middlewares/rateLimiter");
const throttler = require("../middlewares/throttler");

// Protected routes
router.get("/profile",  userController.getProfile);
router.put(
  "/profile",
  userController.updateProfile
);

module.exports = router;

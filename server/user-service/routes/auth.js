const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const rateLimiter = require("../middlewares/rateLimiter");
const throttler = require("../middlewares/throttler");

// Public routes
router.post("/signup", userController.signup);
router.get("/verify-email",  userController.verifyEmail);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/refresh-token", userController.refreshToken);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;

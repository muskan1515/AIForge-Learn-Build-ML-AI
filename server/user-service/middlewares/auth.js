const jwt = require("jsonwebtoken");
const { redisClient } = require("../../packages/config/redisClientConfig");
const { config } = require("../../packages/config/envConfig");
const { verifyAccessToken } = require("../utils/jwtUtils");

/**
 * Middleware to verify JWT access token and check if blacklisted
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired or invalidated" });
    }

    const decoded = verifyAccessToken(token);

    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

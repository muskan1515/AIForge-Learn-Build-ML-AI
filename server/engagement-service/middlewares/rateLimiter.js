const RateLimiter = require('express-rate-limit')

module.exports = RateLimiter({
    windowMs: 5000, // 1000 * 5 secs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many request",
    max: 5
})
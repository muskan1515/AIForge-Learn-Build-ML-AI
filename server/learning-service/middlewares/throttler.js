const slowDown = require('express-slow-down')

module.exports = slowDown({
    windowMs: 5000,
    delayAfter: 5,
    delayMs: 500
})
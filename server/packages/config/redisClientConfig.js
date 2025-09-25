const { Redis } = require('ioredis')
const { config } = require('./envConfig')

const redisClient = new Redis({
    host: config.redis.client,
    port: 6379
})

module.exports = redisClient
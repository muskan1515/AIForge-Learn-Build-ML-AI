const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId: "ai-learning-app",
    brokers: ['localhost:9092/']
})

module.exports = kafka
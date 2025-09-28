// admin.js
const kafka = require("./kafkaConfig");

const createTopic = async () => {
  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "update-content-recommendation",
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });

  console.log("✅ Topic created successfully!");
  await admin.disconnect();
};

module.exports = { createTopic };

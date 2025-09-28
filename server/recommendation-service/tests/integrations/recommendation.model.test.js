// tests/integration/recommendation.model.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserRecommendation = require("../../models/UserRecommendation");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
afterEach(async () => {
  await UserRecommendation.deleteMany();
});

test("create & find recommendations", async () => {
  const doc = await UserRecommendation.create({
    userId: new mongoose.Types.ObjectId(),
    recommendations: [{ contentId: new mongoose.Types.ObjectId(), score: 3 }],
  });
  expect(doc.recommendations.length).toBe(1);

  const found = await UserRecommendation.findOne({ userId: doc.userId }).lean();
  expect(found).toBeTruthy();
});

test("unique userId index prevents duplicates", async () => {
  const userId = new mongoose.Types.ObjectId();
  await UserRecommendation.create({ userId, recommendations: [] });
  await expect(
    UserRecommendation.create({ userId, recommendations: [] })
  ).rejects.toThrow();
});

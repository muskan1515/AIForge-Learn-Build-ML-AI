// tests/integration/recommendation.controller.test.js
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../../app");
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

test("POST /apis/recommendations/upsert - validates and upserts", async () => {
  const payload = {
    userId: new mongoose.Types.ObjectId().toString(),
    items: [{ contentId: new mongoose.Types.ObjectId().toString(), delta: 1 }],
  };
  const res = await request(app)
    .post("/apis/recommendations/upsert")
    .send(payload);
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);

  const doc = await UserRecommendation.findOne({ userId: payload.userId });
  expect(doc).toBeTruthy();
  expect(doc.recommendations.length).toBe(1);
});

test("GET /apis/recommendations/:userId - returns list", async () => {
  const userId = new mongoose.Types.ObjectId();
  await UserRecommendation.create({
    userId,
    recommendations: [
      { contentId: new mongoose.Types.ObjectId(), score: 5 },
      { contentId: new mongoose.Types.ObjectId(), score: 1 },
    ],
  });

  const res = await request(app).get(
    `/apis/recommendations/${userId.toString()}?limit=1`
  );
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBe(1);
});

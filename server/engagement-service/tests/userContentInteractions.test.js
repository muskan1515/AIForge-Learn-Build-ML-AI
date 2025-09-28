/**
 * @file userContentController.test.js
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const express = require("express");
const routes = require("../routes/interactionRoutes");

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use("/api/interactions", routes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("UserContentInteraction API", () => {
  let userId = new mongoose.Types.ObjectId();
  let contentId = new mongoose.Types.ObjectId();

  test("POST /api/interactions → add interaction", async () => {
    const res = await request(app)
      .post("/api/interactions")
      .send({ userId, contentId, interactionType: "liked" });

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBeDefined();
  });

  test("GET /api/interactions/user/:userId → get user interactions", async () => {
    const res = await request(app).get(`/api/interactions/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/interactions/interaction → get specific interaction", async () => {
    const res = await request(app).get(
      `/api/interactions/interaction?userId=${userId}&contentId=${contentId}`
    );
    expect(res.statusCode).toBe(200);
  });
});

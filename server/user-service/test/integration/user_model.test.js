const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../../models/user");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("User Model Tests", () => {
  // ----------------- CREATE -----------------
  it("should create a user successfully", async () => {
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("testuser@example.com");
    expect(user.name).toBe("Test User");
  });

  it("should fail if email already exists", async () => {
    await User.create({
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
    });

    let error;
    try {
      await User.create({
        name: "Another User",
        email: "duplicate@example.com",
        password: "password456",
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Duplicate key error
  });

  // ----------------- READ -----------------
  it("should fetch a user by ID", async () => {
    const created = await User.create({
      name: "Fetch User",
      email: "fetch@example.com",
      password: "password123",
    });

    const found = await User.findById(created._id);

    expect(found).toBeDefined();
    expect(found.email).toBe("fetch@example.com");
    expect(found.name).toBe("Fetch User");
  });

  it("should return null for invalid ID", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const found = await User.findById(invalidId);

    expect(found).toBeNull();
  });

  // ----------------- UPDATE -----------------
  it("should update user data", async () => {
    const user = await User.create({
      name: "Update User",
      email: "update@example.com",
      password: "password123",
    });

    const updated = await User.findByIdAndUpdate(
      user._id,
      { name: "Updated Name" },
      { new: true }
    );

    expect(updated).toBeDefined();
    expect(updated.name).toBe("Updated Name");

    const fresh = await User.findById(user._id);
    expect(fresh.name).toBe("Updated Name");
  });

  it("should return null when updating non-existing user", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const updated = await User.findByIdAndUpdate(
      invalidId,
      { name: "Updated Name" },
      { new: true }
    );

    expect(updated).toBeNull();
  });

  // ----------------- DELETE -----------------
  it("should delete user successfully", async () => {
    const user = await User.create({
      name: "Delete User",
      email: "delete@example.com",
      password: "password123",
    });

    const deleted = await User.findByIdAndDelete(user._id);
    expect(deleted).toBeDefined();
    expect(deleted._id.toString()).toBe(user._id.toString());

    const exists = await User.findById(user._id);
    expect(exists).toBeNull();
  });

  it("should return null when deleting non-existing user", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const deleted = await User.findByIdAndDelete(invalidId);

    expect(deleted).toBeNull();
  });
});

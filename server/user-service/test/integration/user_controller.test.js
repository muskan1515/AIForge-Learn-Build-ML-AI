const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const User = require("../../models/user");
const { app } = require("../../app");
const { generateEmailVerificationToken, generateResetPasswordToken, hashPassword } = require("../../utils/authUtils");

let mongoServer;
let accessToken, refreshToken, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("User/Auth API Tests", () => {

  // ---------------- SIGNUP ----------------
  it("POST /apis/auth/signup - should create a new user", async () => {
    const res = await request(app)
      .post("/apis/auth/signup")
      .send({ name: "Test User", email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("test@example.com");

    userId = res.body.user._id;
  });

  it("POST /apis/auth/signup - should fail on duplicate email", async () => {
    await User.create({ name: "Test User", email: "dup@example.com", password: await hashPassword("password123") });

    const res = await request(app)
      .post("/apis/auth/signup")
      .send({ name: "Dup User", email: "dup@example.com", password: "password123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Email already exists");
  });

  // ---------------- EMAIL VERIFICATION ----------------
  it("POST /apis/auth/verify-email - should verify email", async () => {
    const { token, hashedToken } = generateEmailVerificationToken();
    await User.create({ name: "Verify User", email: "verify@example.com", password: await hashPassword("password123"), verificationToken: hashedToken, verificationTokenExpires: Date.now() + 24*60*60*1000 });

    const res = await request(app)
      .post("/apis/auth/verify-email")
      .send({ token });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.isVerified).toBe(true);
  });

  // ---------------- LOGIN ----------------
  it("POST /apis/auth/login - should login verified user", async () => {
    const password = "password123";
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name: "Login User", email: "login@example.com", password: hashedPassword, isVerified: true });

    const res = await request(app)
      .post("/apis/auth/login")
      .send({ email: "login@example.com", password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    userId = user._id;
  });

  it("POST /apis/auth/login - should not login unverified user", async () => {
    const hashedPassword = await hashPassword("password123");
    await User.create({ name: "Unverified", email: "unverified@example.com", password: hashedPassword, isVerified: false });

    const res = await request(app)
      .post("/apis/auth/login")
      .send({ email: "unverified@example.com", password: "password123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Email not verified");
  });

  // ---------------- PROFILE ----------------
  it("GET /apis/user/profile - should return user profile", async () => {
    const res = await request(app)
      .get("/apis/user/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user._id).toBe(userId.toString());
  });

  it("PUT /apis/user/profile - should update profile", async () => {
    const res = await request(app)
      .put("/apis/user/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Updated Name" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe("Updated Name");
  });

  // ---------------- LOGOUT ----------------
  it("POST /apis/auth/logout - should blacklist tokens", async () => {
    const res = await request(app)
      .post("/apis/auth/logout")
      .send({ accessToken, refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ---------------- REFRESH TOKEN ----------------
  it("POST /apis/auth/refresh-token - should generate new access token", async () => {
    const res = await request(app)
      .post("/apis/auth/refresh-token")
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
  });

  // ---------------- FORGOT & RESET PASSWORD ----------------
  it("POST /apis/auth/forgot-password - should generate reset token", async () => {
    await User.create({ name: "Reset User", email: "reset@example.com", password: await hashPassword("password123"), isVerified: true });

    const res = await request(app)
      .post("/apis/auth/forgot-password")
      .send({ email: "reset@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("POST /apis/auth/reset-password - should reset password successfully", async () => {
    const { token, hashedToken } = generateResetPasswordToken();
    const hashedPassword = await hashPassword("oldpassword");

    await User.create({ name: "Reset Password", email: "resetpass@example.com", password: hashedPassword, resetPasswordToken: hashedToken, resetPasswordExpires: Date.now() + 60*60*1000 });

    const res = await request(app)
      .post("/apis/auth/reset-password")
      .send({ token, newPassword: "newpassword123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

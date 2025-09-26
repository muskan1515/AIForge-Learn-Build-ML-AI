const User = require("../models/user");
const { config } = require("../../packages/config/envConfig");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");
const {
  generateResetPasswordToken,
  hashPassword,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  comparePassword,
  verifyResetPasswordToken,
} = require("../utils/authUtils");
const redisClient = require("../../packages/config/redisClientConfig");

/**
 * Create a new user
 * @param {Object} data - {name, email, password}
 * @returns {Promise<Object>}
 */
const signup = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await hashPassword(data.password);

  const { token, hashedToken } = generateEmailVerificationToken();
  const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

  const user = await User.create({
    ...data,
    password: hashedPassword,
    verificationToken: hashedToken,
    verificationTokenExpires,
  });

  // TODO: send email with verification link containing verificationToken

  return user.toObject();
};

/**
 * Verify user's email
 * @param {string} token
 * @returns {Promise<Object>}
 */
const verifyEmail = async (token) => {
  const hashedToken = verifyEmailVerificationToken(token);
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired verification token");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user.toObject();
};

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} accessToken, refreshToken
 */
const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");
  if (!user.isVerified) throw new Error("Email not verified");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { id: user._id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user: user.toObject() };
};

/**
 * Logout user by blacklisting tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
const logout = async (accessToken, refreshToken) => {
  await redisClient.setex(
    `bl_${accessToken}`,
    config.jwt.accessToken.expiresInMs,
    "blacklisted"
  );
  await redisClient.setex(
    `bl_${refreshToken}`,
    config.jwt.refreshToken.expiresInMs,
    "blacklisted"
  );
  return true;
};

/**
 * Refresh access token
 * @param {string} refreshToken
 * @returns {Promise<string>} new access token
 */
const refreshAccessToken = async (refreshToken) => {
  const isBlacklisted = await redisClient.get(`bl_${refreshToken}`);
  if (isBlacklisted) throw new Error("Invalid token");

  const decoded = verifyRefreshToken(refreshToken);
  const accessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
  });
  return accessToken;
};

/**
 * Forgot password: generate reset token
 * @param {string} email
 * @returns {Promise<string>} token
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const { token: resetToken, hashedToken } = generateResetPasswordToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  // TODO: send email with resetToken link

  return resetToken;
};

/**
 * Reset password
 * @param {string} token
 * @param {string} newPassword
 */
const resetPassword = async (token, newPassword) => {
  const hashedToken = verifyResetPasswordToken(token)

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return true;
};

/**
 * Get user profile
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.toObject();
};

/**
 * Update user profile
 * @param {string} userId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) throw new Error("User not found");
  return user.toObject();
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};

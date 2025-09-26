const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/**
 * Hash Password
 * @param {string} password
 * @returns string
 */
const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare Password & Hash Password
 * @param {} body {password: string, hash: string}
 * @returns string
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Return (plain + hashed) crypto token
 * @returns {} -> {token: string, hashedToken: string}
 */
const generateResetPasswordToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};

/**
 * Verify the reset password token to hash one
 * @param {string} token
 * @param {string} hash
 * @returns boolean
 */
const verifyResetPasswordToken = (token, hash) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Return (plain + hashed) crypto token
 * @returns {} -> {token: string, hashedToken: string}
 */
const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
};

/**
 * Verify the email verification token to hash one
 * @param {string} token
 * @param {string} hash
 * @returns boolean
 */
const verifyEmailVerificationToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  hashPassword,
  comparePassword,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
};

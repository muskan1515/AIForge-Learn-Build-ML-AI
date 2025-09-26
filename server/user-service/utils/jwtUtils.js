const jwt = require("jsonwebtoken");
const { config } = require("../../packages/config/envConfig");

/**
 * Create Access JWT Token
 * @param {*} data {id: string, email: string}
 * @returns JWT Token
 */
const generateAccessToken = (data) => {
  return jwt.sign(data, config.jwt.accessToken.secret, {
    expiresIn: config.jwt.accessToken.expiresIn,
  });
};

/**
 * Verify Access Token
 * @param {*} token
 * @returns null || {id: string, email: string}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessToken.secret);
};

/**
 * Create Refresh JWT Token
 * @param {*} data {id: string}
 * @returns JWT Token
 */
const generateRefreshToken = (data) => {
  return jwt.sign(data, config.jwt.refreshToken.secret, {
    expiresIn: config.jwt.refreshToken.expiresIn,
  });
};

/**
 * Verify Refresh Token
 * @param {*} token
 * @returns null || {id: string}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshToken.secret);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};

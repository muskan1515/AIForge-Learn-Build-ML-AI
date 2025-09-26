const userService = require("../services/user");

/**
 * Controller: Signup
 */
const signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Verify Email
 */
const verifyEmail = async (req, res) => {
  try {
    const user = await userService.verifyEmail(req.query.token);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.login(email, password);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Logout
 */
const logout = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    await userService.logout(accessToken, refreshToken);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Refresh Token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const accessToken = await userService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Forgot Password
 */
const forgotPassword = async (req, res) => {
  try {
    const token = await userService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Reset Password
 */
const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Get Profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Controller: Update Profile
 */
const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};

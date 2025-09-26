const {
  hashPassword,
  comparePassword,
  generateResetPasswordToken,
  verifyResetPasswordToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
} = require("../../utils/authUtils");

describe("Auth Utils", () => {
  it("should hash and verify password properly", async () => {
    const hashedPassword = await hashPassword("password");

    expect(hashedPassword).toBeDefined();
    const isVerified = await comparePassword("password", hashedPassword);

    expect(isVerified).toBe(true);
  });

  it("should return false when password is wrong", async () => {
    const hashedPassword = await hashPassword("password");

    const isVerified = await comparePassword("wrongpassword", hashedPassword);
    expect(isVerified).toBe(false);
  });

  it("should create and verify reset password token successfully", () => {
    const { token: resetPasswordToken, hashedToken } =
      generateResetPasswordToken();

    expect(resetPasswordToken).toBeDefined();
    expect(hashedToken).toBeDefined();

    const newHash = verifyResetPasswordToken(resetPasswordToken);
    const isVerified = newHash == hashedToken;
    expect(isVerified).toBe(true);
  });

  it("should return false when reset password token is wrong", () => {
    const { hashedToken } = generateResetPasswordToken();

    const newHash = verifyResetPasswordToken("wrongToken");
    const isVerified = newHash == hashedToken;
    expect(isVerified).toBe(false);
  });

  it("should create and verify email verification token successfully", () => {
    const { token: emailVerificationToken, hashedToken } =
      generateEmailVerificationToken();

    expect(emailVerificationToken).toBeDefined();
    expect(hashedToken).toBeDefined();

    const newHash = verifyEmailVerificationToken(emailVerificationToken);
    const isVerified = newHash == hashedToken;
    expect(isVerified).toBe(true);
  });

  it("should return false when email verification token is wrong", () => {
    const { hashedToken } = generateEmailVerificationToken();

    const newHash = verifyEmailVerificationToken("wrongToken");
    const isVerified = newHash == hashedToken;
    expect(isVerified).toBe(false);
  });
});

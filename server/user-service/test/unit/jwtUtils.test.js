const {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRefreshToken,
} = require("../../utils/jwtUtils");

describe("JWT Utils", () => {
  const payload = { id: "123", email: "xyz@gmail.com" };
  const refresh_payload = { id: "124" };

  it("should create and verify access properly", () => {
    const token = generateAccessToken(payload);

    expect(token).toBeDefined();
    const decoded = verifyAccessToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe("123");
    expect(decoded.email).toBe("xyz@gmail.com");
  });

  it("verify should throw error when its wrong", () => {
    const token = "kjd0342";

    expect(() => verifyAccessToken(token)).toThrow();
  });

  it("should create and verify refresh properly", () => {
    const token = generateRefreshToken(refresh_payload);

    expect(token).toBeDefined();
    const decoded = verifyRefreshToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.id).toBe("124");
  });

  it("verify should throw error when its wrong", () => {
    const token = "kjd0342";

    expect(() => verifyRefreshToken(token)).toThrow();
  });
});

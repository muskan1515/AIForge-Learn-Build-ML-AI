const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
    },
    
    avatar: {
      type: String, // profile image URL
      default: "",
    },

    // ✅ Auth Tokens
    accessToken: { type: String },
    refreshToken: { type: String },

    // ✅ Email Verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    // ✅ Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // ✅ Learning-specific
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "LearningContent" },
        progress: { type: Number, default: 0 }, // %
        completed: { type: Boolean, default: false },
      },
    ],

    preferences: {
      topics: [{ type: String }], // e.g., ["AI", "System Design"]
      difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

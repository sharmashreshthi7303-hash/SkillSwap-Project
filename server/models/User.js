const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Schema Definition (With profilePic and array defaults)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsHave: { type: [String], default: [] }, // Default empty array zaroori hai
  skillsWant: { type: [String], default: [] }, // Default empty array zaroori hai
  profilePic: { type: String, default: "" }, // Added for profile image sync
});

// 2. Pre-save Middleware for Password Hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // next() call karna safe practice hai

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 3. Model Export
module.exports = mongoose.model("User", UserSchema);

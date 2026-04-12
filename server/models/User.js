const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1. Pehle Schema define karein (Ye zaroori hai!)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsHave: [String],
  skillsWant: [String],
});

// 2. Phir pre-save middleware likhein
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// 3. Sabse aakhiri mein model export karein
module.exports = mongoose.model("User", UserSchema);

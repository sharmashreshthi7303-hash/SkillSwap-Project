const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Aapka Mongoose Model Path

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check karein user pehle se exist toh nahi karta
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 2. Naya user create karein
    const newUser = new User({
      name,
      email,
      password, // Password hashing (bcrypt) agar aapne lagaya ho toh yahan handle karein
      skillsHave: [],
      skillsWant: [],
      profilePic: "",
    });

    // 3. Database mein save karein
    const savedUser = await User.save();

    // 4. CRITICAL: Frontend ko poora format bhejien jo wo localStorage mein expect kar raha hai
    res.status(201).json({
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      skillsHave: savedUser.skillsHave,
      skillsWant: savedUser.skillsWant,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;

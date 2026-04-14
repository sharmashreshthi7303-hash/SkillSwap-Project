const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// --- CORS CONFIGURATION ---
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// 1. MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/skillswap_db")
  .then(() => console.log("✅ MongoDB Connect ho gaya!"))
  .catch((err) => console.log("❌ Connection mein gadbad hai:", err));

// 2. Default Route
app.get("/", (req, res) => {
  res.send("SkillSwap Server chal raha hai! 🚀");
});

// 3. Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Saari details bharna zaroori hai!" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User Register ho gaya! ✅" });
  } catch (err) {
    console.error("DEBUG ERROR ==>", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User nahi mila! Pehle Register karein." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Galat Password! Dubara koshish karein." });
    }
    res.status(200).json({
      message: "Login Safal raha! Welcome back, " + user.name,
      userId: user._id,
    });
  } catch (err) {
    console.error("LOGIN ERROR ==>", err);
    res.status(500).json({ error: "Server mein kuch gadbad hai." });
  }
});

// 5. Update Skills Route
app.post("/update-skills", async (req, res) => {
  try {
    const { userId, skillsHave, skillsWant } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { skillsHave, skillsWant },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User nahi mila!" });
    }
    res.status(200).json({
      message: "Skills update ho gayi! ✅",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UPDATE SKILLS ERROR ==>", err);
    res.status(500).json({ error: "Skills save karne mein problem aayi." });
  }
});

// 6. Find Partners Route (Matching Logic)
app.get("/find-matches/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User nahi mila" });

    const matches = await User.find({
      _id: { $ne: user._id },
      skillsHave: { $in: user.skillsWant },
    });

    res.status(200).json(matches);
  } catch (err) {
    console.error("MATCHING ERROR ==>", err);
    res.status(500).json({ error: "Matching mein kuch issue hai" });
  }
});

// 7. Update User Profile Route (Naya Add kiya gaya)
app.post("/update-profile", async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User nahi mila!" });

    let updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Profile updated successfully! ✅",
      user: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR ==>", err);
    res.status(500).json({ error: "Server mein kuch gadbad hai." });
  }
});

// 8. Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} par start ho gaya`);
});

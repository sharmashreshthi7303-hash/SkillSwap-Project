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
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ Connection mein gadbad hai:", err));

// 2. Default Route
app.get("/", (req, res) => {
  res.send("SkillSwap Server is working ! 🚀");
});

// 3. Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: " All the details must be filled !" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User Registered! ✅" });
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
        .json({ error: "User not found ! First Register yourself ." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: " Wrong Password!Try Again." });
    }
    res.status(200).json({
      message: "Login Sucessfull ! Welcome back, " + user.name,
      userId: user._id,
    });
  } catch (err) {
    console.error("LOGIN ERROR ==>", err);
    res.status(500).json({ error: "Something went wrong in the server." });
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
      return res.status(404).json({ error: "User not found!" });
    }
    res.status(200).json({
      message: "Skills updated ! ✅",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UPDATE SKILLS ERROR ==>", err);
    res
      .status(500)
      .json({ error: "Something went wrong while saving the Skills." });
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
    res.status(500).json({ error: "Matching issue" });
  }
});

// 7. NEW: Get All Users Route (For Explore Page)
app.get("/all-users", async (req, res) => {
  try {
    // Sirf wahi data fetch kar rahe hain jo UI mein zaroori hai (Password hide kiya hai)
    const users = await User.find({}, "name email skillsHave skillsWant");
    res.status(200).json(users);
  } catch (err) {
    console.error("ALL USERS FETCH ERROR ==>", err);
    res.status(500).json({ error: "Data fetching failed" });
  }
});

// 8. Update User Profile Route
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

// 9. Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} par start ho gaya`);
});

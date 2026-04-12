const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// --- CORS CONFIGURATION (Corrected) ---
// Isse hum server ko bata rahe hain ki sirf hamare React app (5173) ko allow kare
app.use(
  cors({
    origin: "http://localhost:5173", // Aapka Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json()); // Body parser hamesha CORS ke niche rakhein

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
    // Asli error message bhej rahe hain taaki frontend par "Kuch gadbad hai" ki jagah sahi reason dikhe
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

// 5. Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} par start ho gaya`);
});

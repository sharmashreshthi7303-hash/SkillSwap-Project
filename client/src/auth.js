// REGISTER ROUTE (BACKEND)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validation check
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // 2. Email check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // 3. New User Object Setup
    const newUser = new User({
      name,
      email,
      password, // User.js ka bcrypt middleware ise automatic hash kar dega
      skillsHave: [],
      skillsWant: [],
      profilePic: "",
    });

    const savedUser = await newUser.save();
    console.log("User successfully saved in MongoDB:", savedUser); // Check terminal log!

    // 4. CRITICAL FIX: Sending full structure back to frontend
    res.status(201).json({
      userId: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      skillsHave: savedUser.skillsHave,
      skillsWant: savedUser.skillsWant,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

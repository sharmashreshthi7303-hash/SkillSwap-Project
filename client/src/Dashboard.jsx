import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [haveInput, setHaveInput] = useState("");
  const [wantInput, setWantInput] = useState("");
  const [skillsHave, setSkillsHave] = useState([]);
  const [skillsWant, setSkillsWant] = useState([]);
  const [matches, setMatches] = useState([]);

  // Profile Edit States
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass, setEditPass] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const updateSkills = async (newHave, newWant) => {
    try {
      await axios.post("http://127.0.0.1:5000/update-skills", {
        userId: user.userId,
        skillsHave: newHave,
        skillsWant: newWant,
      });
    } catch (err) {
      console.error("Update failed");
    }
  };

  const addHaveSkill = () => {
    if (!haveInput) return;
    const updated = [...skillsHave, haveInput];
    setSkillsHave(updated);
    updateSkills(updated, skillsWant);
    setHaveInput("");
  };

  const addWantSkill = () => {
    if (!wantInput) return;
    const updated = [...skillsWant, wantInput];
    setSkillsWant(updated);
    updateSkills(skillsHave, updated);
    setWantInput("");
  };

  const findMatches = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/find-matches/${user.userId}`,
      );
      setMatches(response.data);
    } catch (err) {
      alert("No partners found right now.");
    }
  };

  // --- NAYA: Profile Update Function ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/update-profile",
        {
          userId: user.userId,
          name: editName,
          email: editEmail,
          password: editPass,
        },
      );
      alert(response.data.message);

      // Local Storage update taaki bina logout kiye naya naam dikhe
      const updatedStorage = {
        ...user,
        message: `Welcome back, ${response.data.user.name || editName}`,
      };
      localStorage.setItem("user", JSON.stringify(updatedStorage));
      window.location.reload();
    } catch (err) {
      alert("Update fail ho gaya!");
    }
  };

  if (!user) return <div style={styles.loader}>Connecting...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>

      <nav style={styles.navbar}>
        <h2 style={styles.logo}>SkillSwap 🤝</h2>
        <div style={styles.navLinks}>
          <span style={styles.userName}>
            Hi, <b>{user.message.split(", ")[1]}</b>
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.main}>
        {/* Expertise & Learning Cards */}
        <section style={styles.cardSection}>
          <div style={styles.glassCard}>
            <h3>Expertise 💡</h3>
            <div style={styles.skillList}>
              {skillsHave.map((s, i) => (
                <span key={i} style={styles.pillHave}>
                  {s}
                </span>
              ))}
            </div>
            <div style={styles.inputGroup}>
              <input
                value={haveInput}
                onChange={(e) => setHaveInput(e.target.value)}
                placeholder="Add Skill..."
                style={styles.input}
              />
              <button onClick={addHaveSkill} style={styles.addBtn}>
                +
              </button>
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3>Learning 🎯</h3>
            <div style={styles.skillList}>
              {skillsWant.map((s, i) => (
                <span key={i} style={styles.pillWant}>
                  {s}
                </span>
              ))}
            </div>
            <div style={styles.inputGroup}>
              <input
                value={wantInput}
                onChange={(e) => setWantInput(e.target.value)}
                placeholder="Add Skill..."
                style={styles.input}
              />
              <button onClick={addWantSkill} style={styles.addBtn}>
                +
              </button>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <button onClick={findMatches} style={styles.matchBtn}>
            Find Partners 🔍
          </button>
        </div>

        {/* Matches Grid */}
        <section>
          <h2 style={styles.sectionTitle}>Recommended Partners</h2>
          <div style={styles.matchGrid}>
            {matches.map((m) => (
              <div key={m._id} style={styles.userCard}>
                <div style={styles.avatar}>{m.name[0]}</div>
                <h4>{m.name}</h4>
                <p style={styles.cardSkills}>
                  Teaches: {m.skillsHave.join(", ")}
                </p>
                <a
                  href={`https://wa.me/?text=Hi ${m.name}, let's swap skills!`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button style={styles.contactBtn}>Contact 💬</button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* --- NAYA: Profile Settings Section --- */}
        <section style={{ marginTop: "60px" }}>
          <div style={styles.glassCard}>
            <h2 style={{ marginBottom: "20px" }}>Account Settings ⚙️</h2>
            <form onSubmit={handleProfileUpdate} style={styles.profileForm}>
              <div style={styles.inputWrapper}>
                <label>Change Name</label>
                <input
                  type="text"
                  placeholder="New Name"
                  onChange={(e) => setEditName(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputWrapper}>
                <label>Change Email</label>
                <input
                  type="email"
                  placeholder="New Email"
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputWrapper}>
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  onChange={(e) => setEditPass(e.target.value)}
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.updateBtn}>
                Save Changes
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

// Updated Styles for unique look
const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    top: "-10%",
    left: "-5%",
    width: "400px",
    height: "400px",
    background: "rgba(100, 108, 255, 0.15)",
    borderRadius: "50%",
    filter: "blur(80px)",
  },
  bgCircle2: {
    position: "absolute",
    bottom: "5%",
    right: "-5%",
    width: "350px",
    height: "350px",
    background: "rgba(156, 39, 176, 0.15)",
    borderRadius: "50%",
    filter: "blur(80px)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 50px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logo: { color: "#646cff", margin: 0 },
  userName: { marginRight: "20px", opacity: 0.8 },
  logoutBtn: {
    background: "transparent",
    color: "#ff4757",
    border: "1px solid #ff4757",
    padding: "5px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: { padding: "40px 50px" },
  cardSection: { display: "flex", gap: "20px" },
  glassCard: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.03)",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },
  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "20px 0",
  },
  pillHave: {
    background: "rgba(100, 108, 255, 0.2)",
    color: "#9ea3ff",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  pillWant: {
    background: "rgba(156, 39, 176, 0.2)",
    color: "#e090ff",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  inputGroup: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
  },
  addBtn: {
    background: "#646cff",
    color: "#fff",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  matchBtn: {
    background: "linear-gradient(135deg, #646cff, #9c27b0)",
    color: "#fff",
    border: "none",
    padding: "15px 40px",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  matchGrid: { display: "flex", gap: "20px", flexWrap: "wrap" },
  userCard: {
    background: "rgba(255,255,255,0.05)",
    width: "250px",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  avatar: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #646cff, #9c27b0)",
    borderRadius: "50%",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  cardSkills: { fontSize: "14px", margin: "15px 0", opacity: 0.8 },
  contactBtn: {
    background: "#25d366",
    color: "#fff",
    border: "none",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  sectionTitle: { marginBottom: "30px", fontSize: "2rem" },
  profileForm: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputWrapper: { display: "flex", flexDirection: "column", gap: "8px" },
  updateBtn: {
    background: "#646cff",
    color: "#fff",
    border: "none",
    padding: "15px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    gridColumn: "span 2",
    marginTop: "10px",
  },
  loader: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
};

export default Dashboard;

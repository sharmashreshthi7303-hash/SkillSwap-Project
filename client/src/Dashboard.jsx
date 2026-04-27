import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [haveInput, setHaveInput] = useState("");
  const [wantInput, setWantInput] = useState("");
  const [skillsHave, setSkillsHave] = useState([]);
  const [skillsWant, setSkillsWant] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);
    else window.location.href = "/login";
  }, []);

  const updateSkills = async (h, w) => {
    try {
      await axios.post("http://127.0.0.1:5000/update-skills", {
        userId: user.userId,
        skillsHave: h,
        skillsWant: w,
      });
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const addHaveSkill = () => {
    if (!haveInput) return toast.warn("Enter skill!");
    const updated = [...skillsHave, haveInput];
    setSkillsHave(updated);
    updateSkills(updated, skillsWant);
    setHaveInput("");
    toast.success("Added Expertise!");
  };

  const findMatches = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/find-matches/${user.userId}`,
      );
      setMatches(res.data);
      toast.success(`${res.data.length} matches found!`);
    } catch (err) {
      toast.error("Error finding matches");
    }
  };

  if (!user)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        background: "#0f172a",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <Sidebar />
      <div style={{ marginLeft: "260px", padding: "40px", width: "100%" }}>
        <header style={{ marginBottom: "40px" }}>
          <h1>Welcome, {user.message.split(", ")[1]} 🚀</h1>
          <p style={{ opacity: 0.6 }}>
            Manage your skills and find your learning partner.
          </p>
        </header>

        <section style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
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
                placeholder="e.g. React"
                style={styles.input}
              />
              <button onClick={addHaveSkill} style={styles.addBtn}>
                +
              </button>
            </div>
          </div>
          {/* Repeat similar for Learning card... */}
        </section>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <button onClick={findMatches} style={styles.matchBtn}>
            Find Matches 🔍
          </button>
        </div>

        <div style={styles.matchGrid}>
          {matches.map((m) => (
            <div key={m._id} style={styles.userCard}>
              <div style={styles.avatar}>{m.name[0]}</div>
              <h4>{m.name}</h4>
              <p style={{ fontSize: "12px", opacity: 0.6 }}>{m.email}</p>
              <button style={styles.contactBtn}>Connect 💬</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  glassCard: {
    flex: 1,
    background: "rgba(255,255,255,0.03)",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  skillList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "15px 0",
  },
  pillHave: {
    background: "rgba(100, 108, 255, 0.2)",
    color: "#9ea3ff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  inputGroup: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
  },
  addBtn: {
    background: "#646cff",
    color: "#fff",
    border: "none",
    padding: "0 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  matchBtn: {
    background: "linear-gradient(135deg, #646cff, #9c27b0)",
    color: "#fff",
    border: "none",
    padding: "15px 40px",
    borderRadius: "30px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  matchGrid: { display: "flex", gap: "20px", flexWrap: "wrap" },
  userCard: {
    background: "rgba(255,255,255,0.03)",
    padding: "20px",
    borderRadius: "20px",
    width: "220px",
    textAlign: "center",
  },
  avatar: {
    width: "50px",
    height: "50px",
    background: "#646cff",
    borderRadius: "50%",
    margin: "0 auto 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  contactBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#25d366",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

export default Dashboard;

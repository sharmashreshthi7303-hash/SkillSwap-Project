import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);

  // Skills state for summary
  const [skillsHave, setSkillsHave] = useState([]);
  const [skillsWant, setSkillsWant] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
      // Data load hote hi skills set karein
      setSkillsHave(data.skillsHave || ["React", "Node.js"]); // Fallback values
      setSkillsWant(data.skillsWant || ["Python", "AWS"]);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const findMatches = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/find-matches/${user.userId}`,
      );
      setMatches(res.data);
      toast.success(`${res.data.length} Partners found!`);
    } catch (err) {
      toast.error("Error fetching matches");
    }
  };

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar />

      <div style={{ marginLeft: "280px", padding: "40px", width: "100%" }}>
        <h1 style={{ color: "#fff", fontSize: "2.5rem", marginBottom: "10px" }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "40px" }}>
          Here is what's happening with your skill swap journey.
        </p>

        {/* RESTORED: Summary Cards Section */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <h3 style={{ color: "#646cff", marginBottom: "15px" }}>
              My Expertise 💡
            </h3>
            <div style={styles.tagContainer}>
              {skillsHave.map((s) => (
                <span key={s} style={styles.tag}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.summaryCard}>
            <h3 style={{ color: "#9c27b0", marginBottom: "15px" }}>
              Learning Goals 🎯
            </h3>
            <div style={styles.tagContainer}>
              {skillsWant.map((s) => (
                <span key={s} style={{ ...styles.tag, borderColor: "#9c27b0" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button onClick={findMatches} style={styles.matchBtn}>
          Find New Partners 🔍
        </button>

        <h2 style={{ color: "#fff", marginTop: "50px", marginBottom: "20px" }}>
          Suggested Matches
        </h2>
        <div style={styles.grid}>
          {matches.length > 0 ? (
            matches.map((m) => (
              <div key={m._id} style={styles.card}>
                <div style={styles.avatar}>{m.name[0]}</div>
                <h4 style={{ color: "#fff", marginTop: "15px" }}>{m.name}</h4>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                  Expert in: {m.skillsHave.join(", ")}
                </p>
                <button style={styles.connectBtn}>Connect 💬</button>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>
              Click 'Find New Partners' to see people you can swap skills with.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  summaryGrid: { display: "flex", gap: "25px", marginBottom: "40px" },
  summaryCard: {
    flex: 1,
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  tagContainer: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tag: {
    padding: "5px 12px",
    borderRadius: "20px",
    border: "1px solid #646cff",
    fontSize: "12px",
    color: "#fff",
  },
  grid: { display: "flex", flexWrap: "wrap", gap: "25px" },
  card: {
    background: "#1e293b",
    width: "240px",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
  },
  avatar: {
    width: "50px",
    height: "50px",
    background: "#646cff",
    borderRadius: "50%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  matchBtn: {
    padding: "12px 30px",
    background: "#646cff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  connectBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    background: "transparent",
    color: "#646cff",
    border: "1px solid #646cff",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Dashboard;

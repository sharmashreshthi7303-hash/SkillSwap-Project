import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Function to load fresh data from localStorage
  const loadUserData = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for profile updates from Profile.jsx without refresh
    window.addEventListener("storage_update", loadUserData);

    return () => window.removeEventListener("storage_update", loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const findMatches = async () => {
    const loadingToast = toast.loading("Finding best partners...");
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/find-matches/${user?.userId}`,
      );
      setMatches(res.data);
      toast.update(loadingToast, {
        render: "Matches updated!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: "Error fetching matches",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return toast.error("Please enter a skill");
    const updatedUser = { ...user };
    if (modalType === "Have")
      updatedUser.skillsHave = [...(user.skillsHave || []), newSkill];
    else updatedUser.skillsWant = [...(user.skillsWant || []), newSkill];

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Notify Sidebar and Header about skill updates
    window.dispatchEvent(new Event("storage_update"));

    setNewSkill("");
    setIsModalOpen(false);
    toast.success("Profile Updated!");
  };

  if (!user)
    return (
      <div style={{ color: "white", padding: "20px" }}>Loading Profile...</div>
    );

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>
              Professional <span style={{ color: "#646cff" }}>Profile</span>
            </h1>
          </div>

          <div style={styles.headerRight}>
            <button onClick={findMatches} style={styles.refreshBtn}>
              Analyze Partners 🔍
            </button>
            <div style={styles.vLine}></div>

            {/* HEADER USER SECTION START */}
            <div style={styles.userSection}>
              <div style={styles.userAvatarSmall}>
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : user?.name ? (
                  user.name[0].toUpperCase()
                ) : (
                  "?"
                )}
              </div>
              <div style={styles.userInfoText}>
                <span style={styles.userName}>{user?.name || "User"}</span>
                <span style={styles.userStatus}>Online</span>
              </div>
              <button
                onClick={handleLogout}
                style={styles.logoutIconButton}
                title="Logout"
              >
                Logout 🚪
              </button>
            </div>
            {/* HEADER USER SECTION END */}
          </div>
        </header>

        <div style={styles.dashboardGrid}>
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.largeAvatar}>
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : user?.name ? (
                  user.name[0].toUpperCase()
                ) : (
                  "?"
                )}
              </div>
              <h2 style={{ marginTop: "15px" }}>{user?.name || "User"}</h2>
              <p style={{ color: "#94a3b8" }}>{user?.email || "Member"}</p>
              <div style={styles.badge}>Active Pro</div>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>User ID</span>
                <span style={styles.detailValue}>
                  #{user?.userId?.slice(-6) || "N/A"}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Connections</span>
                <span style={styles.detailValue}>{matches.length}</span>
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div style={styles.skillsSection}>
            <div style={styles.cardHeader}>
              <h3>Expertise & Goals</h3>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                Update your skills dynamically
              </p>
            </div>

            <div style={styles.skillBox}>
              <div style={styles.boxHeader}>
                <span style={styles.boxTitle}>MY EXPERTISE</span>
                <button
                  onClick={() => {
                    setModalType("Have");
                    setIsModalOpen(true);
                  }}
                  style={styles.miniAddBtn}
                >
                  + Add
                </button>
              </div>
              <div style={styles.tagGrid}>
                {user.skillsHave?.map((s) => (
                  <span key={s} style={styles.tagBlue}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...styles.skillBox, marginTop: "25px" }}>
              <div style={styles.boxHeader}>
                <span style={styles.boxTitle}>LEARNING GOALS</span>
                <button
                  onClick={() => {
                    setModalType("Want");
                    setIsModalOpen(true);
                  }}
                  style={styles.miniAddBtn}
                >
                  + Add
                </button>
              </div>
              <div style={styles.tagGrid}>
                {user.skillsWant?.map((s) => (
                  <span key={s} style={styles.tagPurple}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matches Section */}
        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
          Partner Recommendations
        </h3>
        <div style={styles.matchList}>
          {matches.map((m) => (
            <div key={m._id} style={styles.matchItem}>
              <div style={styles.smallAvatar}>{m.name ? m.name[0] : "?"}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{m.name}</h4>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Expert in: {m.skillsHave?.join(", ")}
                </p>
              </div>
              <button style={styles.connectBtn}>Connect</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal same as before */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Add {modalType === "Have" ? "Expertise" : "Goal"}</h3>
            <input
              style={styles.modalInput}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Skill name..."
              autoFocus
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button onClick={handleAddSkill} style={styles.saveBtn}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0b0f1a",
    color: "#fff",
  },
  mainContent: {
    marginLeft: "280px",
    padding: "40px",
    width: "calc(100% - 280px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    background: "#161b22",
    padding: "15px 25px",
    borderRadius: "15px",
    border: "1px solid #30363d",
  },
  headerLeft: { flex: 1 },
  headerRight: { display: "flex", alignItems: "center", gap: "20px" },
  vLine: { width: "1px", height: "30px", background: "#30363d" },
  title: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
  userSection: { display: "flex", alignItems: "center", gap: "12px" },
  userAvatarSmall: {
    width: "35px",
    height: "35px",
    background: "#646cff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    overflow: "hidden",
  },
  userInfoText: { display: "flex", flexDirection: "column" },
  userName: { fontSize: "14px", fontWeight: "600" },
  userStatus: { fontSize: "10px", color: "#10b981" },
  logoutIconButton: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  refreshBtn: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid #646cff",
    color: "#646cff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "30px",
  },
  profileCard: {
    background: "#161b22",
    borderRadius: "20px",
    padding: "30px",
    border: "1px solid #30363d",
    textAlign: "center",
  },
  profileHeader: { paddingBottom: "25px", borderBottom: "1px solid #30363d" },
  largeAvatar: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #646cff, #9c27b0)",
    borderRadius: "50%",
    margin: "0 auto",
    fontSize: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    background: "rgba(100, 108, 255, 0.2)",
    color: "#646cff",
    borderRadius: "20px",
    fontSize: "12px",
    marginTop: "10px",
  },
  profileDetails: { marginTop: "25px", textAlign: "left" },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  detailLabel: { color: "#94a3b8", fontSize: "14px" },
  detailValue: { fontWeight: "600" },
  skillsSection: {
    background: "#161b22",
    borderRadius: "20px",
    padding: "30px",
    border: "1px solid #30363d",
  },
  cardHeader: { marginBottom: "25px" },
  skillBox: {
    background: "#0b0f1a",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #30363d",
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  boxTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#8b949e",
    letterSpacing: "1px",
  },
  miniAddBtn: {
    background: "transparent",
    color: "#646cff",
    border: "1px solid #646cff",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  tagGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tagBlue: {
    padding: "6px 14px",
    background: "rgba(100, 108, 255, 0.1)",
    color: "#646cff",
    borderRadius: "8px",
    fontSize: "13px",
  },
  tagPurple: {
    padding: "6px 14px",
    background: "rgba(156, 39, 176, 0.1)",
    color: "#9c27b0",
    borderRadius: "8px",
    fontSize: "13px",
  },
  matchList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  matchItem: {
    background: "#161b22",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #30363d",
  },
  smallAvatar: {
    width: "40px",
    height: "40px",
    background: "#30363d",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  connectBtn: {
    padding: "6px 12px",
    background: "transparent",
    color: "#646cff",
    border: "1px solid #646cff",
    borderRadius: "6px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modalContent: {
    background: "#161b22",
    padding: "30px",
    borderRadius: "20px",
    width: "400px",
    border: "1px solid #30363d",
  },
  modalInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #30363d",
    background: "#0b0f1a",
    color: "#fff",
    marginTop: "15px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelBtn: { background: "transparent", border: "none", color: "#94a3b8" },
  saveBtn: {
    background: "#646cff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Dashboard;

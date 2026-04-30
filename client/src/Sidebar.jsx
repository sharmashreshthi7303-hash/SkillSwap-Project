import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  // Local storage se data load karne ka function
  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) setCurrentUser(data);
  };

  useEffect(() => {
    loadData();

    // Custom event "storage_update" ko listen karna
    window.addEventListener("storage_update", loadData);

    // Cleanup listener on unmount
    return () => window.removeEventListener("storage_update", loadData);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>SkillSwap 🤝</h2>

      {/* --- PROFILE SECTION START --- */}
      <div style={styles.profileSection}>
        <div style={styles.sidebarAvatar}>
          {currentUser?.profilePic ? (
            <img
              src={currentUser.profilePic}
              alt="Profile"
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.initials}>
              {currentUser?.name ? currentUser.name[0].toUpperCase() : "?"}
            </div>
          )}
        </div>
        <p style={styles.userNameSide}>{currentUser?.name || "User"}</p>
      </div>
      {/* --- PROFILE SECTION END --- */}

      <nav style={styles.navStack}>
        <Link
          to="/dashboard"
          style={isActive("/dashboard") ? styles.activeLink : styles.link}
        >
          🏠 Dashboard
        </Link>
        <Link
          to="/explore"
          style={isActive("/explore") ? styles.activeLink : styles.link}
        >
          🔍 Explore
        </Link>
        <Link
          to="/profile"
          style={isActive("/profile") ? styles.activeLink : styles.link}
        >
          👤 Profile
        </Link>
      </nav>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        style={styles.logoutBtn}
      >
        Logout 🚪
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "#020617",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    padding: "40px 20px",
    zIndex: 1000,
  },
  logo: {
    color: "#646cff",
    marginBottom: "30px",
    fontWeight: "800",
    textAlign: "center",
    fontSize: "1.8rem",
  },
  // New Profile Styles
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  sidebarAvatar: {
    width: "70px",
    height: "70px",
    marginBottom: "10px",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #646cff",
  },
  initials: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#30363d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
  },
  userNameSide: {
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
  },
  // Navigation Styles
  navStack: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
  link: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.6)",
    padding: "12px 20px",
    borderRadius: "10px",
    transition: "0.3s",
  },
  activeLink: {
    textDecoration: "none",
    color: "#fff",
    background: "#646cff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "transparent",
    color: "#ff4757",
    border: "1px solid #ff4757",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "20px",
  },
};

export default Sidebar;

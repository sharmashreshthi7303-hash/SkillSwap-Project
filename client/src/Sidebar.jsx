import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>SkillSwap 🤝</h2>

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
    background: "#020617", // Pure Dark background
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
    marginBottom: "40px",
    fontWeight: "800",
    textAlign: "center",
    fontSize: "1.8rem",
  },
  navStack: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
  link: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.6)",
    padding: "12px 20px",
    borderRadius: "10px",
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
  },
};

export default Sidebar;

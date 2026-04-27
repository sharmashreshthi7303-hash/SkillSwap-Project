import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // Check karne ke liye ki kaunsa page active hai
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
          🔍 Explore Partners
        </Link>

        <Link
          to="/profile"
          style={isActive("/profile") ? styles.activeLink : styles.link}
        >
          👤 My Profile
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
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(15px)", // Glass effect
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
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
    marginBottom: "50px",
    fontWeight: "800",
    textAlign: "center",
    fontSize: "1.8rem",
  },
  navStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  },
  link: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.6)",
    padding: "14px 20px",
    borderRadius: "12px",
    transition: "0.3s ease",
    fontSize: "1rem",
    fontWeight: "500",
  },
  activeLink: {
    textDecoration: "none",
    color: "#fff",
    background: "rgba(100, 108, 255, 0.15)",
    padding: "14px 20px",
    borderRadius: "12px",
    borderLeft: "5px solid #646cff", // Blue indicator
    fontSize: "1rem",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(100, 108, 255, 0.1)",
  },
  logoutBtn: {
    background: "transparent",
    color: "#ff4757",
    border: "1px solid #ff4757",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "0.3s",
    marginTop: "20px",
  },
};

export default Sidebar;

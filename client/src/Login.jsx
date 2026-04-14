import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });
      alert(response.data.message);
      // Success hone par user details local storage mein save karein
      localStorage.setItem("user", JSON.stringify(response.data));
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.error || "Login fail ho gaya!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Decorative Circles */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>

      <div style={styles.glassBox}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={styles.title}>Welcome Back 🔑</h1>
          <p style={styles.subtitle}>
            Log in to continue your SkillSwap journey.
          </p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginBtn}>
            Login to Dashboard 🚀
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a href="/" style={styles.link}>
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a", // Match with Register Page
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    top: "-5%",
    right: "-5%",
    width: "450px",
    height: "450px",
    background: "rgba(100, 108, 255, 0.12)",
    borderRadius: "50%",
    filter: "blur(100px)",
    zIndex: 0,
  },
  bgCircle2: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background: "rgba(156, 39, 176, 0.12)",
    borderRadius: "50%",
    filter: "blur(100px)",
    zIndex: 0,
  },
  glassBox: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(25px)",
    padding: "45px",
    borderRadius: "30px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  title: {
    color: "#fff",
    fontSize: "2rem",
    margin: "0 0 8px",
    fontWeight: "700",
    background: "linear-gradient(to right, #6e8efb, #a777e3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", margin: 0 },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    marginTop: "35px",
  },
  inputWrapper: { display: "flex", flexDirection: "column", gap: "10px" },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.85rem",
    fontWeight: "500",
    marginLeft: "5px",
  },
  input: {
    padding: "14px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "0.3s",
  },
  loginBtn: {
    background: "linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)",
    color: "#fff",
    border: "none",
    padding: "16px",
    borderRadius: "15px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(110, 142, 251, 0.3)",
    marginTop: "12px",
    transition: "0.4s",
  },
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    marginTop: "30px",
    fontSize: "0.9rem",
  },
  link: { color: "#6e8efb", textDecoration: "none", fontWeight: "600" },
};

export default Login;

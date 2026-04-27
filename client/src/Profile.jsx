import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) setUser(data);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/update-profile", {
        userId: user.userId,
        name,
        email,
        password,
      });
      toast.success("Profile Updated! Reloading...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!user) return null;

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
        <h1>My Profile 👤</h1>
        <div
          style={{
            maxWidth: "500px",
            background: "rgba(255,255,255,0.03)",
            padding: "30px",
            borderRadius: "25px",
            marginTop: "30px",
          }}
        >
          <form
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <input
              placeholder="New Name"
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="New Email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.btn}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  input: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
  },
  btn: {
    padding: "12px",
    background: "#646cff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Profile;

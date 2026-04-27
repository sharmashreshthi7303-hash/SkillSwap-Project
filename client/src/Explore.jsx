import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

function Explore() {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/all-users"); // Iska backend route hum abhi banayenge
        setAllUsers(response.data);
      } catch (err) {
        toast.error("Users load nahi ho paye");
      }
    };
    fetchUsers();
  }, []);

  const filtered = allUsers.filter((u) =>
    u.skillsHave.some((s) => s.toLowerCase().includes(search.toLowerCase())),
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
      <div style={{ marginLeft: "280px", padding: "40px", width: "100%" }}>
        <h1>Explore Partners 🔍</h1>
        <input
          placeholder="Search any skill..."
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          {filtered.map((u) => (
            <div key={u._id} style={styles.card}>
              <div style={styles.avatar}>{u.name[0]}</div>
              <h3>{u.name}</h3>
              <p>Expert in: {u.skillsHave.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  search: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "20px",
    width: "250px",
    textAlign: "center",
  },
  avatar: {
    width: "60px",
    height: "60px",
    background: "#646cff",
    borderRadius: "50%",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
};

export default Explore;

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill all fields!");
    }

    try {
      // Backend api hit
      const res = await axios.post("http://127.0.0.1:5000/register", formData);

      // CRITICAL: Saving full object inside localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Welcome to SkillSwap! 🎉");

      // Global context check updates
      window.dispatchEvent(new Event("storage_update"));

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f1a",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          background: "#161b22",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          border: "1px solid #30363d",
        }}
      >
        <h2
          style={{
            color: "#646cff",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Register
        </h2>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "#0b0f1a",
            border: "1px solid #30363d",
            color: "#fff",
          }}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "#0b0f1a",
            border: "1px solid #30363d",
            color: "#fff",
          }}
        />

        <input
          type="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "#0b0f1a",
            border: "1px solid #30363d",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;

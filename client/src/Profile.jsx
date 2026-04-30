import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        profilePic: data.profilePic || "",
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // UPDATED: handleSave function with global event dispatch
  const handleSave = () => {
    if (!formData.name || !formData.email) {
      return toast.error("Name and Email are required!");
    }

    const updatedUser = { ...user, ...formData };

    // Password field empty hai toh use update na karein
    if (!formData.password) {
      delete updatedUser.password;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // CRITICAL: Ye line dusre components (Sidebar/Header) ko notify karegi
    window.dispatchEvent(new Event("storage_update"));

    toast.success("Profile updated successfully! ✨");
  };

  if (!user) {
    return (
      <div style={{ color: "white", padding: "20px" }}>Loading Profile...</div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        <h1 style={styles.pageTitle}>My Profile 👤</h1>

        <div style={styles.profileBox}>
          <div style={styles.imageUploadSection}>
            <div style={styles.avatarWrapper}>
              {formData.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  style={styles.profileImg}
                />
              ) : (
                <div style={styles.initialsAvatar}>
                  {user?.name ? user.name[0].toUpperCase() : "?"}
                </div>
              )}
              <label htmlFor="file-input" style={styles.editIcon}>
                📷
              </label>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <p style={styles.uploadHint}>Click icon to change photo</p>
          </div>

          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="New Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="email"
              placeholder="New Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={styles.input}
            />
            <button onClick={handleSave} style={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
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
    padding: "60px",
    width: "calc(100% - 280px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    fontWeight: "700",
    width: "100%",
    textAlign: "left",
  },
  profileBox: {
    background: "#161b22",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid #30363d",
    textAlign: "center",
  },
  imageUploadSection: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid #646cff",
    padding: "3px",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  },
  initialsAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#30363d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
  },
  editIcon: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    background: "#646cff",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  uploadHint: { fontSize: "12px", color: "#94a3b8", marginTop: "10px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "20px" },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #30363d",
    background: "#0b0f1a",
    color: "#fff",
    outline: "none",
    fontSize: "16px",
  },
  saveBtn: {
    padding: "16px",
    background: "#646cff",
    border: "none",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Profile;

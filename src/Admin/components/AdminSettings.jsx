import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AdminSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    site_name: "",
    contact_email: "",
    maintenance_mode: false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Admin settings saved successfully!");
      navigate("/admin");
    }, 1200);
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Settings</h1>
          <div style={styles.badge}>Manage</div>
        </div>

        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Site Name</label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter site name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter admin email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Maintenance Mode</label>
            <input
              type="checkbox"
              name="maintenance_mode"
              checked={settings.maintenance_mode}
              onChange={handleChange}
              style={{ transform: "scale(1.2)", cursor: "pointer" }}
            />{" "}
            <span style={{ marginLeft: "0.5rem", color: "#27374d" }}>
              Enable maintenance mode
            </span>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.button,
                ...(saving ? styles.buttonDisabled : {}),
                ...styles.primaryButton,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={styles.info}>
          Manage global admin settings for the application
        </div>
      </div>
    </div>
  );
}

// Reuse same styles from ProfilePage
const styles = {
  container: {
    minHeight: "100vh",
    minWidth: "100vw",
    background:
      "linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: "480px",
    width: "90%",
    boxShadow: "0 20px 40px rgba(39, 55, 77, 0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#27374d",
    margin: 0,
    background: "linear-gradient(135deg, #27374d 0%, #526d82 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  badge: {
    background: "linear-gradient(135deg, #27374d 0%, #526d82 100%)",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "16px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(39, 55, 77, 0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#27374d",
  },
  input: {
    padding: "0.9rem",
    border: "2px solid #dde6ed",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    background: "rgba(255, 255, 255, 0.8)",
    outline: "none",
    color: "#27374d",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  button: {
    padding: "0.9rem 1.8rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    minWidth: "130px",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #27374d 0%, #526d82 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(39, 55, 77, 0.3)",
  },
  secondaryButton: {
    background: "rgba(157, 178, 191, 0.3)",
    color: "#27374d",
    border: "2px solid #9db2bf",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  info: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "rgba(52, 152, 219, 0.1)",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#2980b9",
    fontStyle: "italic",
    lineHeight: "1.4",
  },
};

export default AdminSettings;

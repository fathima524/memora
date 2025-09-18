import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    year_of_study: "",
    email: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user & profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error(userError);
        navigate("/login");
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, year_of_study, email")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
      }

      setProfile({
        full_name: profileData?.full_name || "",
        year_of_study: profileData?.year_of_study || "",
        email: profileData?.email || user.email || ""
      });

      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        year_of_study: profile.year_of_study,
        email: profile.email
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error updating profile. Please try again.");
      return;
    }
    
    alert("Profile updated successfully!");
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingText}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Profile</h1>
          <div style={styles.badge}>Profile Settings</div>
        </div>

        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Year of Study</label>
            <input
              type="text"
              name="year_of_study"
              value={profile.year_of_study}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., 1st Year, 2nd Year, Graduate"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email address"
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.button,
                ...(saving ? styles.buttonDisabled : {}),
                ...styles.primaryButton
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              Cancel
            </button>
          </div>
        </form>

        <div style={styles.info}>
          Your profile information helps personalize your study experience
        </div>
      </div>
    </div>
  );
}

// STYLES SECTION - Responsive with no white corners and smaller container
const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },

  profileCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    maxWidth: window.innerWidth <= 480 ? '320px' : window.innerWidth <= 768 ? '400px' : '480px',
    width: window.innerWidth <= 480 ? '90%' : window.innerWidth <= 768 ? '85%' : '100%',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    margin: '1rem'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    flexWrap: 'wrap',
    gap: '0.8rem'
  },

  title: {
    fontSize: window.innerWidth <= 480 ? '1.4rem' : window.innerWidth <= 768 ? '1.6rem' : '1.8rem',
    fontWeight: '700',
    color: '#27374d',
    margin: 0,
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  badge: {
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem',
    borderRadius: '16px',
    fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)',
    whiteSpace: 'nowrap'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: window.innerWidth <= 480 ? '1rem' : '1.2rem'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },

  label: {
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    color: '#27374d',
    marginBottom: '0.3rem'
  },

  input: {
    padding: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
    border: '2px solid #dde6ed',
    borderRadius: '10px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    fontFamily: 'inherit',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    outline: 'none',
    color: '#27374d',
    width: '100%',
    boxSizing: 'border-box'
  },

  buttonGroup: {
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: window.innerWidth <= 480 ? '0.8rem' : '1rem'
  },

  button: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.5rem' : '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: window.innerWidth <= 480 ? '120px' : '130px',
    flexShrink: 0
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)'
  },

  secondaryButton: {
    background: 'rgba(157, 178, 191, 0.3)',
    color: '#27374d',
    border: '2px solid #9db2bf'
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },

  info: {
    marginTop: window.innerWidth <= 480 ? '1.2rem' : '1.5rem',
    padding: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    background: 'rgba(52, 152, 219, 0.1)',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.85rem',
    color: '#2980b9',
    fontStyle: 'italic',
    lineHeight: '1.4'
  },

  loadingContainer: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0',
    padding: '0'
  },

  loadingCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 480 ? '2rem' : '2.5rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    margin: '1rem'
  },

  loadingText: {
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    color: '#27374d',
    textAlign: 'center',
    fontWeight: '600'
  }
};

export default ProfilePage;
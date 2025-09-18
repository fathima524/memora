import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import { supabase } from "../supabase/supabaseClient";
import Select from "react-select";

// Helper functions for dynamic styles
const getSubscriptionBadgeStyle = (subscriptionStatus) => ({
  background: subscriptionStatus === "Premium"
    ? "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
    : "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",
  borderRadius: "12px",
  padding: "5px 10px",
  color: "white",
  fontWeight: "bold",
  fontSize: "0.9rem",
});

const getButtonHoverHandlers = () => ({
  onMouseEnter: (e) => {
    e.target.style.background =
      "linear-gradient(135deg, #1e2a3a 0%, #455a6b 100%)";
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 8px 25px rgba(39, 55, 77, 0.4)";
  },
  onMouseLeave: (e) => {
    e.target.style.background =
      "linear-gradient(135deg, #27374d 0%, #526d82 100%)";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 15px rgba(39, 55, 77, 0.3)";
  },
});

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [streak, setStreak] = useState(0);
  const [questionsToday, setQuestionsToday] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState("Free");
  const [selectedChallengeSubjects, setSelectedChallengeSubjects] = useState([
    "all",
  ]);
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      setUser(user);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) return;

      setUserName(profileData.full_name || "Student");
      setStreak(profileData.current_streak || 0);
      setQuestionsToday(profileData.questions_today || 0);
      setRecentActivity(profileData.recent_activity || []);
      setSubscriptionStatus(profileData.subscription_status || "Free");
    };

    fetchUserAndProfile();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setSubjects(data);

      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  // Update recentActivity when returning from Flashcard
  useEffect(() => {
    if (location.state?.completedSession) {
      const activity = JSON.parse(localStorage.getItem("recentActivity")) || [];
      setRecentActivity(activity);
      setStreak(parseInt(localStorage.getItem("currentStreak") || "0"));
      setQuestionsToday(parseInt(localStorage.getItem("questionsToday") || "0"));
    }
  }, [location.state?.completedSession]);

  const handleStartStudy = () => {
    if (!selectedSubject) {
      alert("Please select a subject to start studying!");
      return;
    }

    const selectedSubjectName =
      subjects.find((s) => s.id === selectedSubject)?.name || "Unknown";

    navigate("/flashcard", {
      state: {
        subject: selectedSubject,
        subjectName: selectedSubjectName,
        difficulty: selectedDifficulty,
        mode: "premium",
      },
    });
  };

  const handleChallengeMode = () => {
    if (selectedChallengeSubjects.length === 0) {
      alert("Please select at least one subject!");
      return;
    }

    navigate("/flashcard", {
      state: {
        subject: selectedChallengeSubjects.includes("all")
          ? "all"
          : selectedChallengeSubjects,
        difficulty: "mixed",
        mode: "challenge",
      },
    });
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.dashboardGrid}>
          {/* Welcome Card */}
          <div style={styles.welcomeCard}>
            
            <h1 style={styles.title}>Welcome back, {userName}! 👋</h1>
            <p style={styles.subtitle}>
              Ready to ace your MBBS exams? Continue your learning journey!
            </p>
          </div>

          {/* Study Session */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Study Session</h3>
            <label style={styles.label}>Choose Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a subject...</option>
              {loadingSubjects ? (
                <option value="">Loading subjects...</option>
              ) : (
                subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              )}
            </select>

            <label style={styles.label}>Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={styles.select}
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>

            <button
              style={styles.button}
              onClick={handleStartStudy}
              {...getButtonHoverHandlers()}
            >
              Start Study
            </button>
          </div>

          {/* Challenge Yourself */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>🔥 Challenge Yourself</h3>
            <p style={styles.sectionSubtitle}>
              Select one or more subjects (or All Subjects) to start a mixed challenge.
            </p>

            <Select
  isMulti
  options={subjects.map((s) => ({ value: s.id, label: s.name }))} // removed "All Subjects"
  value={subjects
    .filter((s) => selectedChallengeSubjects.includes(s.id))
    .map((s) => ({ value: s.id, label: s.name }))}
  onChange={(selected) => {
    setSelectedChallengeSubjects(selected.map((opt) => opt.value)); // simplified, no "all" logic
  }}
  placeholder="Search or select subjects..."
  styles={{
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      padding: "2px",
      borderColor: "#27374d",
      boxShadow: "none",
      "&:hover": { borderColor: "#526d82" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#27374d"
        : state.isFocused
        ? "#f1f3f6"
        : "white",
      color: state.isSelected ? "white" : "#27374d",
    }),
  }}
/>

            <button
              style={styles.button}
              onClick={handleChallengeMode}
              {...getButtonHoverHandlers()}
            >
              🔥 Start Challenge
            </button>
          </div>

          {/* Stats */}
          <div style={styles.statCard}>
            <div style={styles.statContainer}>
              <div>
                <div style={styles.statNumber}>{streak}</div>
                <div style={styles.statLabel}>🔥 Day Streak</div>
              </div>
              <div style={styles.statDivider}></div>
              <div>
                <div style={styles.statNumber}>{questionsToday}</div>
                <div style={styles.statLabel}>📝 Questions Today</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>📈 Recent Activity</h3>
            {recentActivity.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activitySubject}>
                  {activity.subject} - {activity.questions} questions
                </div>
              </div>
            ))}

            <button
              style={styles.statsButton}
              onClick={() => navigate("/streaks")}
            >
              📊 View All Stats
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}



// Styles object - moved to bottom for better code organization
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  },

  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 0'
  },

  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.25), 0 8px 16px rgba(39, 55, 77, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },

  welcomeCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.25), 0 8px 16px rgba(39, 55, 77, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 2',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(39, 55, 77, 0.95) 0%, rgba(82, 109, 130, 0.95) 100%)',
    color: 'white',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },

  title: {
    fontSize: window.innerWidth <= 768 ? '2rem' : '2.8rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'white',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineHeight: '1.2'
  },

  subtitle: {
    fontSize: window.innerWidth <= 768 ? '1rem' : '1.3rem',
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: '2rem',
    lineHeight: '1.4'
  },

  sectionTitle: {
    fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.6rem',
    fontWeight: '700',
    color: '#27374d',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#526d82',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
    fontWeight: '500'
  },

  select: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #dde6ed',
    borderRadius: '12px',
    fontSize: '1rem',
    color: '#27374d',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2327374d' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px'
  },

  button: {
    width: '100%',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)'
  },

  quickActionButton: {
    padding: '0.8rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    flex: '1',
    minWidth: '120px'
  },

  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.25), 0 8px 16px rgba(39, 55, 77, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
  },

  statNumber: {
    fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem',
    fontWeight: '700',
    color: '#27374d',
    marginBottom: '0.5rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },

  statLabel: {
    fontSize: '1rem',
    color: '#526d82',
    fontWeight: '600'
  },

  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(157, 178, 191, 0.1)',
    borderRadius: '12px',
    marginBottom: '0.8rem',
    border: '1px solid rgba(157, 178, 191, 0.2)'
  },

  subscriptionBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#526d82',
    marginBottom: '0.5rem',
    display: 'block'
  },

  statContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center'
  },

  statDivider: {
    width: '2px',
    height: '60px',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    borderRadius: '1px'
  },

  activitySubject: {
    fontWeight: '600',
    color: '#27374d',
    fontSize: '0.95rem'
  },

  activityTime: {
    fontSize: '0.8rem',
    color: '#526d82'
  },

  activityScore: {
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },

  statsButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #9db2bf 0%, #526d82 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)',
    fontSize: '0.95rem',
    padding: '0.8rem 1.5rem',
    marginTop: '1rem'
  },

  quickActionContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1rem'
  }
};

export default Dashboard;
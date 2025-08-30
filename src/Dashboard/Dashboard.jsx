import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import subjectsData from "../data/subjects.json";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [streak, setStreak] = useState(5);
  const [questionsToday, setQuestionsToday] = useState(12);
  const [recentActivity, setRecentActivity] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState("Free");

  useEffect(() => {
    // Get user data from localStorage
    const storedName = localStorage.getItem("userName");
    const storedStreak = localStorage.getItem("currentStreak");
    const storedQuestions = localStorage.getItem("questionsToday");
    const storedSubscription = localStorage.getItem("subscriptionStatus");
    
    if (storedName) setUserName(storedName);
    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedQuestions) setQuestionsToday(parseInt(storedQuestions));
    if (storedSubscription) setSubscriptionStatus(storedSubscription);

    // Load recent activity
    const activity = JSON.parse(localStorage.getItem("recentActivity")) || [
      { subject: "Anatomy", score: "8/10", time: "2 hours ago" },
      { subject: "Physiology", score: "9/10", time: "Yesterday" },
      { subject: "Biochemistry", score: "7/10", time: "2 days ago" }
    ];
    setRecentActivity(activity);
  }, []);

  const handleStartStudy = () => {
    if (!selectedSubject) {
      alert("Please select a subject to start studying!");
      return;
    }
    
    navigate("/flashcard", { 
      state: { 
        subject: selectedSubject, 
        difficulty: selectedDifficulty,
        mode: "premium"
      } 
    });
  };

  const handleQuickStart = (difficulty) => {
    navigate("/flashcard", { 
      state: { 
        subject: "mixed", 
        difficulty: difficulty,
        mode: "free_trial",
        questionLimit: 5
      } 
    });
  };

  const handleChallengeMode = () => {
    navigate("/flashcard", { 
      state: { 
        subject: "challenge", 
        difficulty: "mixed",
        mode: "challenge"
      } 
    });
  };

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const dashboardGridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 0'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '2rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.25), 0 8px 16px rgba(39, 55, 77, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const welcomeCardStyle = {
    ...cardStyle,
    gridColumn: window.innerWidth <= 768 ? '1' : 'span 2',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(39, 55, 77, 0.95) 0%, rgba(82, 109, 130, 0.95) 100%)',
    color: 'white',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const titleStyle = {
    fontSize: window.innerWidth <= 768 ? '2rem' : '2.8rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: 'white',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: window.innerWidth <= 768 ? '1rem' : '1.3rem',
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: '2rem',
    lineHeight: '1.4'
  };

  const sectionTitleStyle = {
    fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.6rem',
    fontWeight: '700',
    color: '#27374d',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const selectStyle = {
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
  };

  const buttonStyle = {
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
  };

  const quickActionButtonStyle = {
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
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
  };

  const statNumberStyle = {
    fontSize: window.innerWidth <= 768 ? '2.5rem' : '3.5rem',
    fontWeight: '700',
    color: '#27374d',
    marginBottom: '0.5rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const statLabelStyle = {
    fontSize: '1rem',
    color: '#526d82',
    fontWeight: '600'
  };

  const activityItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(157, 178, 191, 0.1)',
    borderRadius: '12px',
    marginBottom: '0.8rem',
    border: '1px solid rgba(157, 178, 191, 0.2)'
  };

  const subscriptionBadgeStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: subscriptionStatus === 'Premium' 
      ? 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' 
      : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={dashboardGridStyle}>
          {/* Welcome Card */}
          <div style={welcomeCardStyle}>
            <div style={subscriptionBadgeStyle}>
              {subscriptionStatus}
            </div>
            <h1 style={titleStyle}>
              Welcome back, {userName || "Student"}! 👋
            </h1>
            <p style={subtitleStyle}>
              Ready to ace your MBBS exams? Try our free questions or continue your learning journey!
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1rem'
            }}>
              
             
             
            </div>
          </div>

          {/* Subject Selection */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
               Study Session
            </h3>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#526d82', marginBottom: '0.5rem', display: 'block' }}>
              Choose Subject
            </label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={selectStyle}
            >
              <option value="">Select a subject...</option>
              {subjectsData.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.questions.length} questions)
                </option>
              ))}
            </select>
            
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#526d82', marginBottom: '0.5rem', display: 'block' }}>
              Difficulty Level
            </label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={selectStyle}
            >
              <option value="easy">🟢 Easy - Build Confidence</option>
              <option value="medium">🟡 Medium - Challenge Yourself</option>
              <option value="hard">🔴 Hard - Master Level</option>
            </select>

            <button 
              style={buttonStyle}
              onClick={handleStartStudy}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1e2a3a 0%, #455a6b 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(39, 55, 77, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #27374d 0%, #526d82 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(39, 55, 77, 0.3)';
              }}
            >
               Start Study
            </button>
            <div style={{
              fontSize: '0.8rem',
              color: '#9db2bf',
              textAlign: 'center',
              marginTop: '0.5rem',
              fontStyle: 'italic'
            }}>
              Requires subscription
            </div>
          </div>

          {/* Challenge Mode */}
          <div style={cardStyle}>
            <h3 style={{...sectionTitleStyle, fontWeight: '800', fontSize: '1.8rem'}}>
              🎯 Challenge Yourself
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#526d82',
              marginBottom: '1.5rem',
              lineHeight: '1.4',
              fontWeight: '500'
            }}>
              Random questions from all subjects with mixed difficulty levels. Test your overall knowledge!
            </p>
            <button 
              style={buttonStyle}
              onClick={handleChallengeMode}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1e2a3a 0%, #455a6b 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(39, 55, 77, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #27374d 0%, #526d82 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(39, 55, 77, 0.3)';
              }}
            >
              🔥 Start Challenge
            </button>
          </div>

          {/* Combined Stats Card */}
          <div style={statCardStyle}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div>
                <div style={statNumberStyle}>{streak}</div>
                <div style={statLabelStyle}>🔥 Day Streak</div>
              </div>
              <div style={{
                width: '2px',
                height: '60px',
                background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
                borderRadius: '1px'
              }}></div>
              <div>
                <div style={statNumberStyle}>{questionsToday}</div>
                <div style={statLabelStyle}>📝 Questions Today</div>
              </div>
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#9db2bf',
              marginTop: '1rem',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              Keep up the momentum!
            </div>
          </div>

          {/* Recent Activity */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              📈 Recent Activity
            </h3>
            {recentActivity.map((activity, index) => (
              <div key={index} style={activityItemStyle}>
                <div>
                  <div style={{ fontWeight: '600', color: '#27374d', fontSize: '0.95rem' }}>
                    {activity.subject}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#526d82' }}>
                    {activity.time}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {activity.score}
                </div>
              </div>
            ))}
            <button 
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #9db2bf 0%, #526d82 100%)',
                fontSize: '0.95rem',
                padding: '0.8rem 1.5rem'
              }}
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

export default Dashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Streaks() {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Load streak data from localStorage
    const streak = localStorage.getItem("currentStreak") || 0;
    const longest = localStorage.getItem("longestStreak") || 0;
    const weekly = JSON.parse(localStorage.getItem("weeklyProgress")) || [
      { day: "Mon", completed: true },
      { day: "Tue", completed: true },
      { day: "Wed", completed: false },
      { day: "Thu", completed: true },
      { day: "Fri", completed: false },
      { day: "Sat", completed: false },
      { day: "Sun", completed: false }
    ];

    setCurrentStreak(parseInt(streak));
    setLongestStreak(parseInt(longest));
    setWeeklyProgress(weekly);

    // Show celebration for milestones
    if (parseInt(streak) > 0 && parseInt(streak) % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3), 0 8px 16px rgba(39, 55, 77, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '2rem',
    width: '100%',
    maxWidth: '600px'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#27374d',
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const streakNumberStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#27374d',
    textAlign: 'center',
    marginBottom: '1rem'
  };

  const streakLabelStyle = {
    fontSize: '1.2rem',
    color: '#526d82',
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const weeklyGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
    marginBottom: '2rem'
  };

  const dayStyle = (completed) => ({
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
    background: completed 
      ? 'linear-gradient(135deg, #27374d 0%, #526d82 100%)' 
      : 'rgba(157, 178, 191, 0.3)',
    color: completed ? 'white' : '#526d82'
  });

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
    marginTop: '1rem'
  };

  const celebrationStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '20px',
    textAlign: 'center',
    zIndex: 1000,
    animation: 'bounce 0.5s ease-in-out',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Your Study Streak 🔥</h1>
        
        <div style={streakNumberStyle}>{currentStreak}</div>
        <div style={streakLabelStyle}>
          {currentStreak === 1 ? "Day" : "Days"} in a row!
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(157, 178, 191, 0.2)',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#27374d' }}>
              {longestStreak}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#526d82' }}>
              Longest Streak
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#27374d' }}>
              {weeklyProgress.filter(day => day.completed).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#526d82' }}>
              This Week
            </div>
          </div>
        </div>

        <h3 style={{
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#27374d',
          marginBottom: '1rem'
        }}>
          This Week's Progress
        </h3>

        <div style={weeklyGridStyle}>
          {weeklyProgress.map((day, index) => (
            <div key={index} style={dayStyle(day.completed)}>
              <div>{day.day}</div>
              <div style={{ marginTop: '0.5rem' }}>
                {day.completed ? "✓" : "○"}
              </div>
            </div>
          ))}
        </div>

        <button 
          style={buttonStyle}
          onClick={() => navigate("/dashboard")}
        >
          Continue Studying
        </button>
      </div>

      {showCelebration && (
        <div style={celebrationStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Amazing!
          </div>
          <div style={{ fontSize: '1rem' }}>
            You've reached a {currentStreak}-day streak!
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          40% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
          60% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default Streaks;
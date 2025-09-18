import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

function Streaks({ user }) {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!user) {
        console.warn("Streaks.jsx: No user provided!");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("current_streak, last_study_date, recent_activity, longest_streak")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching streak data:", error);
        return;
      }

      const streak = data.current_streak || 0;
      let longest = data.longest_streak || streak;

      // Update longest streak in Supabase if needed
      if (streak > longest) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ longest_streak: streak })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating longest streak:", updateError);
        } else {
          longest = streak;
        }
      }

      setCurrentStreak(streak);
      setLongestStreak(longest);

      const recentActivity = data.recent_activity || [];

      // Weekly progress calculation
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const todayIndex = new Date().getDay();

      const weekly = weekDays.map((day, index) => {
        const dayDate = new Date();
        const offset = (todayIndex - index + 7) % 7;
        dayDate.setDate(dayDate.getDate() - offset);
        const dayStr = dayDate.toDateString();

        const completed = recentActivity.some((act) => {
          const [datePart, timePart] = act.timestamp.split(", ");
          const [d, m, y] = datePart.split("/").map(Number);
          const [h, min, s] = timePart.split(":").map(Number);
          const activityDate = new Date(y, m - 1, d, h, min, s);
          return activityDate.toDateString() === dayStr;
        });

        return { day, completed };
      });

      setWeeklyProgress(weekly);

      // Celebration for multiples of 5
      if (streak > 0 && streak % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    fetchStreakData();
  }, [user]);

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
          marginBottom: window.innerWidth <= 480 ? '1rem' : '1.2rem',
          padding: window.innerWidth <= 480 ? '0.6rem' : '0.8rem',
          background: 'rgba(157, 178, 191, 0.2)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.2rem', 
              fontWeight: '700', 
              color: '#27374d' 
            }}>
              {longestStreak}
            </div>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.8rem', 
              color: '#526d82' 
            }}>
              Longest Streak
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.2rem', 
              fontWeight: '700', 
              color: '#27374d' 
            }}>
              {weeklyProgress.filter(day => day.completed).length}
            </div>
            <div style={{ 
              fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.8rem', 
              color: '#526d82' 
            }}>
              This Week
            </div>
          </div>
        </div>

        <h3 style={{
          fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem',
          fontWeight: '600',
          color: '#27374d',
          marginBottom: window.innerWidth <= 480 ? '0.6rem' : '0.8rem'
        }}>
          This Week's Progress
        </h3>

        <div style={weeklyGridStyle}>
          {weeklyProgress.map((day, index) => (
            <div key={index} style={dayStyle(day.completed)}>
              <div>{day.day}</div>
              <div style={{ marginTop: '0.2rem' }}>
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
          <div style={{ fontSize: window.innerWidth <= 480 ? '2rem' : '2.5rem', marginBottom: '0.8rem' }}>🎉</div>
          <div style={{ 
            fontSize: window.innerWidth <= 480 ? '1rem' : '1.2rem', 
            fontWeight: '700', 
            marginBottom: '0.4rem' 
          }}>
            Amazing!
          </div>
          <div style={{ fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem' }}>
            You've reached a {currentStreak}-day streak!
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES SECTION - Full page background with smaller card container
const containerStyle = {
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
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  boxSizing: 'border-box',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0'
};

const cardStyle = {
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
};

const titleStyle = {
  fontSize: window.innerWidth <= 480 ? '1.4rem' : '1.6rem',
  fontWeight: '700',
  color: '#27374d',
  textAlign: 'center',
  marginBottom: window.innerWidth <= 480 ? '1rem' : '1.2rem'
};

const streakNumberStyle = {
  fontSize: window.innerWidth <= 480 ? '2rem' : '2.5rem',
  fontWeight: '700',
  color: '#27374d',
  textAlign: 'center',
  marginBottom: window.innerWidth <= 480 ? '0.6rem' : '0.8rem'
};

const streakLabelStyle = {
  fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem',
  color: '#526d82',
  textAlign: 'center',
  marginBottom: window.innerWidth <= 480 ? '1rem' : '1.2rem'
};

const weeklyGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: window.innerWidth <= 480 ? '0.25rem' : '0.3rem',
  marginBottom: window.innerWidth <= 480 ? '1rem' : '1.2rem'
};

const dayStyle = (completed) => ({
  padding: window.innerWidth <= 480 ? '0.5rem 0.3rem' : '0.6rem 0.4rem',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: window.innerWidth <= 480 ? '0.6rem' : '0.7rem',
  fontWeight: '600',
  background: completed 
    ? 'linear-gradient(135deg, #27374d 0%, #526d82 100%)' 
    : 'rgba(157, 178, 191, 0.3)',
  color: completed ? 'white' : '#526d82',
  minHeight: window.innerWidth <= 480 ? '40px' : '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const buttonStyle = {
  width: '100%',
  padding: window.innerWidth <= 480 ? '0.7rem 1.2rem' : '0.8rem 1.5rem',
  background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: window.innerWidth <= 480 ? '0.6rem' : '0.8rem'
};

const celebrationStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
  color: 'white',
  padding: window.innerWidth <= 480 ? '1.2rem' : '1.5rem',
  borderRadius: '16px',
  textAlign: 'center',
  zIndex: 1000,
  animation: 'bounce 0.5s ease-in-out',
  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)',
  maxWidth: window.innerWidth <= 480 ? '240px' : '280px',
  width: window.innerWidth <= 480 ? '80%' : 'auto'
};

export default Streaks;
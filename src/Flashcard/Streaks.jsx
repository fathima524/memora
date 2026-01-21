import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import { Flame, Trophy, Calendar, ChevronLeft, Star, TrendingUp } from 'lucide-react';

function Streaks({ user }) {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreakData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("current_streak, recent_activity, longest_streak")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching streak data:", error);
        setLoading(false);
        return;
      }

      const streak = data.current_streak || 0;
      const longest = data.longest_streak || streak;

      setCurrentStreak(streak);
      setLongestStreak(longest);

      const recentActivity = data.recent_activity || [];
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();

      const weekly = weekDays.map((day, index) => {
        const d = new Date();
        const diff = d.getDay() - index;
        d.setDate(d.getDate() - diff);
        const dateStr = d.toLocaleDateString('en-GB'); // DD/MM/YYYY

        const completed = recentActivity.some(act => act.timestamp.startsWith(dateStr));
        return { day, completed, isToday: index === today.getDay() };
      });

      setWeeklyProgress(weekly);
      setLoading(false);
    };

    fetchStreakData();
  }, [user]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="streaks-page">
      <Navbar />

      <main className="streaks-container">
        <div className="mesh-bg"></div>

        <div className="streaks-content">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Back
          </button>

          <div className="main-stat-card">
            <div className="flame-container">
              <Flame size={80} className="flame-icon" />
              <div className="streak-count">{currentStreak}</div>
            </div>
            <h1>Day Streak</h1>
            <p className="subtitle">You're on fire! Keep the momentum going to master your clinical concepts.</p>

            <div className="stats-grid">
              <div className="stat-pill">
                <Trophy size={20} className="icon-gold" />
                <div className="pill-text">
                  <span>Best Streak</span>
                  <strong>{longestStreak} Days</strong>
                </div>
              </div>
              <div className="stat-pill">
                <TrendingUp size={20} className="icon-blue" />
                <div className="pill-text">
                  <span>Week Finish</span>
                  <strong>{Math.round((weeklyProgress.filter(d => d.completed).length / 7) * 100)}%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <div className="section-header">
              <Calendar size={20} />
              <h2>Weekly Activity</h2>
            </div>
            <div className="calendar-strip">
              {weeklyProgress.map((day, idx) => (
                <div key={idx} className={`day-card ${day.completed ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}>
                  <span className="day-name">{day.day}</span>
                  <div className="status-indicator">
                    {day.completed ? <Star size={16} fill="currentColor" /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="motivation-card">
            <div className="quote">"Consistency is the key to medical mastery. Every flashcard today is a step closer to being a better doctor tomorrow."</div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .streaks-page {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .streaks-container {
          position: relative;
          padding: 8rem 2rem 4rem;
          min-height: calc(100vh - 80px);
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .mesh-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 40%);
          z-index: 1;
        }

        .streaks-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          padding: 0.75rem 1.25rem;
          border-radius: 14px;
          cursor: pointer;
          width: fit-content;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .main-stat-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
        }

        .flame-container {
          position: relative;
          width: fit-content;
          margin: 0 auto 2rem;
        }

        .flame-icon {
          color: #f97316;
          filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.4));
          animation: flicker 2s infinite ease-in-out;
        }

        .streak-count {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -20%);
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
        }

        .main-stat-card h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .subtitle {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .stat-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .pill-text {
          display: flex;
          flex-direction: column;
        }

        .pill-text span {
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
        }

        .pill-text strong {
          font-size: 1.125rem;
          color: white;
        }

        .icon-gold { color: #eab308; }
        .icon-blue { color: #3b82f6; }

        .progress-section {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          padding: 2.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          color: #cbd5e1;
        }

        .calendar-strip {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.75rem;
        }

        .day-card {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .day-card.today {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
        }

        .day-card.completed {
          background: #2563eb;
          border-color: #3b82f6;
          color: white;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
        }

        .day-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
        }

        .completed .day-name { color: rgba(255, 255, 255, 0.8); }

        .status-indicator {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .motivation-card {
          padding: 2rem;
          text-align: center;
          font-style: italic;
          color: #94a3b8;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }

        .loading-screen {
          min-height: 100vh;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(37, 99, 235, 0.2);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .streaks-container { padding: 6rem 1.5rem 4rem; }
          .main-stat-card { padding: 3rem 1.5rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .calendar-strip { gap: 0.5rem; }
          .day-card { border-radius: 12px; }
        }
      `}</style>
    </div>
  );
}

export default Streaks;
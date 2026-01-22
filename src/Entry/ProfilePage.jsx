import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Activity,
  Award,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    year_of_study: "",
    email: "",
    current_streak: 0,
    longest_streak: 0,
    questions_today: 0,
    recent_activity: []
  });
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/login");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile({
        full_name: profileData?.full_name || "",
        year_of_study: profileData?.year_of_study || "",
        email: profileData?.email || user.email || "",
        current_streak: profileData?.current_streak || 0,
        longest_streak: profileData?.longest_streak || 0,
        questions_today: profileData?.questions_today || 0,
        recent_activity: profileData?.recent_activity || []
      });

      // Fetch all subjects with total question counts
      const { data: subData } = await supabase
        .from("subjects")
        .select("id, name")
        .order("name", { ascending: true });

      if (subData) {
        // Fetch total question count for each subject
        const subjectsWithCounts = await Promise.all(subData.map(async (s) => {
          const { count } = await supabase
            .from("flashcards")
            .select("*", { count: 'exact', head: true })
            .eq("subject_id", s.id);
          return { name: s.name, total_questions: count || 0 };
        }));
        setAllSubjects(subjectsWithCounts);
      }

      setLoading(false);
    };
    fetchUserProfile();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
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
    if (error) alert("Error updating profile.");
    else {
      alert("Profile updated successfully!");
      navigate("/dashboard");
    }
  };

  const COLORS = {
    mastered: '#22c55e',
    good: '#38bdf8',
    weak: '#f87171'
  };

  // Aggregate accuracy by subject for unified visualization
  const subjectMap = {};

  // Initialize map with all subjects (0% mastery)
  allSubjects.forEach(subObj => {
    if (subObj.name !== "Mixed Study") {
      subjectMap[subObj.name] = {
        name: subObj.name,
        totalCorrect: 0,
        totalAttempted: 0,
        studied: false,
        total_questions: subObj.total_questions || 1 // Avoid division by zero
      };
    }
  });

  // Overlay actual performance from recent activity
  profile.recent_activity.forEach(act => {
    if (act.subject !== "Mixed Study" && subjectMap[act.subject]) {
      const qCount = act.questions || 0;
      const acc = act.accuracy || 0;
      subjectMap[act.subject].totalAttempted += qCount;
      subjectMap[act.subject].totalCorrect += (acc / 100) * qCount;
      subjectMap[act.subject].studied = true;
    }
  });

  const barData = Object.values(subjectMap).map(s => {
    // Calculate raw accuracy from all attempts
    const rawAccuracy = s.totalAttempted > 0 ? (s.totalCorrect / s.totalAttempted) * 100 : 0;

    // Calculate mastery based on coverage of total questions in the subject
    const coverageFactor = Math.min(s.totalAttempted / s.total_questions, 1);
    const accuracy = Math.round(rawAccuracy * coverageFactor);

    let status = 'weak';

    if (!s.studied) status = 'weak'; // Not studied yet = focus area
    else if (accuracy >= 85) status = 'mastered';
    else if (accuracy >= 60) status = 'good';

    return {
      name: s.name,
      accuracy,
      status,
      fill: s.studied ? COLORS[status] : 'rgba(255,255,255,0.05)'
    };
  }).sort((a, b) => b.accuracy - a.accuracy);

  const weakSubjects = barData
    .filter(d => d.status === 'weak' || d.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const strongSubjects = barData
    .filter(d => d.status === 'mastered')
    .slice(0, 3);

  if (loading) return (
    <div className="profile-loading">
      <div className="loader"></div>
      <style>{`.profile-loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; } .loader { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="auth-mesh"></div>
      <Navbar />

      <main className="profile-main">
        <div className="profile-header">
          <div className="header-title-row">
            <h1>Account Settings</h1>
            <div className="medical-id-tag">
              <Stethoscope size={16} />
              <span>Medical ID: Profile used to curate high-yield content for your clinical stage</span>
            </div>
          </div>
          <p>Manage your academic details and track your professional learning progress.</p>
        </div>

        <div className="profile-layout-single">
          {/* Settings and Analytics */}
          <div className="profile-content-area">
            {/* Visual Analytics */}
            <div className="unified-analytics-container">
              <div className="chart-container glass-panel-v2">
                <div className="chart-header">
                  <div className="chart-title-group">
                    <TrendingUp size={18} className="text-blue" />
                    <h3>Unified Subject Performance</h3>
                  </div>
                  <p>Comprehensive accuracy mapping across your entire medical curriculum.</p>
                </div>

                <div className="analytics-layout-grid">
                  <div className="chart-box-horizontal">
                    <ResponsiveContainer width="100%" height={isMobile ? 600 : 400}>
                      <BarChart
                        data={barData}
                        layout={isMobile ? "vertical" : "horizontal"}
                        margin={isMobile ? { top: 5, right: 30, left: 20, bottom: 5 } : { top: 20, right: 30, left: 0, bottom: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={!isMobile} horizontal={isMobile} />
                        {isMobile ? (
                          <>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={100}
                              fontSize={10}
                              tick={{ fill: '#94a3b8' }}
                              axisLine={false}
                              tickLine={false}
                            />
                          </>
                        ) : (
                          <>
                            <XAxis
                              dataKey="name"
                              stroke="#94a3b8"
                              fontSize={11}
                              tick={{ fill: '#94a3b8' }}
                              tickLine={false}
                              axisLine={false}
                              angle={-45}
                              textAnchor="end"
                              interval={0}
                            />
                            <YAxis
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              domain={[0, 100]}
                              tickFormatter={(v) => `${v}%`}
                            />
                          </>
                        )}
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '12px',
                            color: '#ffffff',
                            zIndex: 1000
                          }}
                          labelStyle={{ color: '#ffffff', fontWeight: '600' }}
                          itemStyle={{ color: '#ffffff' }}
                        />
                        <Bar dataKey="accuracy" radius={isMobile ? [0, 8, 8, 0] : [8, 8, 0, 0]} barSize={isMobile ? 18 : 28}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="strategic-insights">
                    <div className="insight-card focus">
                      <header>
                        <ShieldAlert size={16} />
                        <h4>Priority Focus Required</h4>
                      </header>
                      <p>You should solve more questions in these areas to improve clinical proficiency:</p>
                      <div className="subject-list-v2">
                        {weakSubjects.length > 0 ? weakSubjects.map(s => (
                          <div key={s.name} className="subject-pill weak">
                            <span>{s.name}</span>
                            <span className="acc-val">{s.accuracy}%</span>
                          </div>
                        )) : <div className="no-data">All subjects are currently in good standing.</div>}
                      </div>
                    </div>

                    <div className="insight-card strength">
                      <header>
                        <Award size={16} />
                        <h4>Current Strengths</h4>
                      </header>
                      <p>You have demonstrated high mastery in these subjects:</p>
                      <div className="subject-list-v2">
                        {strongSubjects.length > 0 ? strongSubjects.map(s => (
                          <div key={s.name} className="subject-pill strong">
                            <span>{s.name}</span>
                            <span className="acc-val">{s.accuracy}%</span>
                          </div>
                        )) : <div className="no-data">Keep studying to reach mastery levels.</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-panel glass-panel">
              <form onSubmit={handleSave}>
                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Doctor Name"
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-wrapper disabled">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="disabled-input"
                      />
                      <span className="input-hint">Email cannot be changed</span>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Academic Details</h3>
                  <div className="input-group">
                    <label>Year of Study</label>
                    <select
                      value={profile.year_of_study}
                      onChange={e => setProfile({ ...profile, year_of_study: e.target.value })}
                      className="premium-select"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year MBBS</option>
                      <option value="2nd Year">2nd Year MBBS</option>
                      <option value="3rd Year">3rd Year MBBS</option>
                      <option value="Final Year">Final Year MBBS</option>
                      <option value="Intern">Intern / Junior Doctor</option>
                      <option value="Post-Grad">Post-Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => navigate("/dashboard")} className="btn-cancel">Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? <div className="spinner"></div> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .profile-page {
          min-height: 100vh;
          background: #0f172a;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.05) 0%, transparent 40%);
          z-index: 0;
          pointer-events: none;
        }

        .profile-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 140px 2rem 6rem;
          position: relative;
          z-index: 1;
        }

        .profile-header {
          margin-bottom: 3.5rem;
        }

        .profile-header h1 {
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -1.5px;
          margin-bottom: 0.75rem;
        }

        .profile-header p {
          color: #94a3b8;
          font-size: 1.125rem;
        }

        .profile-layout-single {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .medical-id-tag {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          color: #38bdf8;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .analytics-section-full {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .analytics-layout-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: stretch;
        }

        .chart-box-horizontal {
          width: 100%;
          background: rgba(15, 23, 42, 0.2);
          border-radius: 20px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .strategic-insights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 800px) {
          .strategic-insights {
            grid-template-columns: 1fr;
          }
        }

        .strategic-insights {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .insight-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .insight-card.focus { border-left: 4px solid #f87171; }
        .insight-card.strength { border-left: 4px solid #22c55e; }

        .insight-card header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .insight-card h4 {
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .insight-card.focus h4 { color: #f87171; }
        .insight-card.strength h4 { color: #22c55e; }

        .insight-card p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .subject-list-v2 {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .subject-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          background: rgba(255,255,255,0.03);
        }

        .subject-pill.weak { background: rgba(248, 113, 113, 0.05); color: #fecaca; }
        .subject-pill.strong { background: rgba(34, 197, 94, 0.05); color: #bbf7d0; }

        .acc-val { font-family: monospace; font-size: 1rem; }

        .no-data {
          font-size: 0.8rem;
          color: #64748b;
          font-style: italic;
          text-align: center;
          padding: 1rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: 0.3s;
        }

        .stat-card-premium:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-icon.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
        .stat-icon.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .stat-icon.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; }

        .stat-info-v2 { display: flex; flex-direction: column; }
        .stat-v { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1; }
        .stat-l { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.5px; }

        .analytics-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .glass-panel-v2 {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2rem;
        }

        .chart-header { margin-bottom: 2rem; }
        .chart-title-group { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
        .chart-title-group h3 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #f1f5f9; margin: 0; }
        .chart-header p { font-size: 0.8rem; color: #64748b; margin: 0; }

        .text-blue { color: #38bdf8; }
        .text-indigo { color: #818cf8; }

        .glass-panel {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.3);
        }

        .section-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #38bdf8;
          margin-bottom: 2rem;
          font-weight: 800;
        }

        .form-section {
          margin-bottom: 3.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #cbd5e1;
        }

        .input-group input, .premium-select {
          padding: 1.125rem 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
        }

        .input-group input:focus, .premium-select:focus {
          border-color: #2563eb;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .disabled-input {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-hint {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.5rem;
          display: block;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1.25rem;
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .btn-cancel {
          padding: 1rem 2rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-cancel:hover { background: rgba(255,255,255,0.05); color: white; }

        .btn-save {
          padding: 1rem 2.5rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .btn-save:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
        }

        .stats-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-card {
          padding: 2.5rem;
          text-align: center;
        }

        .profile-avatar-box {
          width: 72px; height: 72px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
        }

        .sidebar-card h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.75rem; }
        .sidebar-card p { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; }

        .sidebar-card.premium {
          background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
          border: 1px solid #334155;
        }

        .premium-badge {
          background: #fbbf24;
          color: #78350f;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 900;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .btn-upgrade-glow {
          width: 100%;
          margin-top: 1.75rem;
          padding: 1rem;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
        }

        .btn-upgrade-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4);
        }

        .spinner {
          width: 20px; height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .profile-container { padding: 4rem 1.25rem 2.5rem; }
          .profile-grid { grid-template-columns: 1fr; gap: 2rem; }
          .stats-sidebar { order: -1; }
          .hero-header { padding: 2.5rem 1.5rem; text-align: center; border-radius: 28px; }
          .header-content { flex-direction: column; gap: 1.5rem; }
          .user-name { font-size: 2.25rem; letter-spacing: -1px; }
          .stat-summary-row { justify-content: center; flex-wrap: wrap; gap: 1.25rem; }
          .user-avatar { margin: 0 auto; width: 64px; height: 64px; font-size: 1.5rem; }
          .sidebar-card { padding: 1.5rem; border-radius: 24px; }
        }

        @media (max-width: 480px) {
          .profile-container { padding-top: 5rem; }
          .hero-header { padding: 2rem 1rem; }
          .user-name { font-size: 1.85rem; }
          .tab-nav { padding: 0.4rem; border-radius: 12px; }
          .tab-btn { padding: 0.6rem 0.8rem; font-size: 0.8rem; }
          .glass-panel { padding: 1.25rem; }
        }
      `}</style>
    </div >
  );
}
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import "./ProfilePage.css";
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

import { toast } from "sonner";

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
        .from("subjects_with_stats")
        .select("id, name, total_questions")
        .order("name", { ascending: true });

      if (subData) {
        setAllSubjects(subData);
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
    if (error) toast.error("Error updating profile.");
    else {
      toast.success("Profile updated successfully!");
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
    </div>
  );
}

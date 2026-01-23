import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import { supabase } from "../supabase/supabaseClient";
import Select from "react-select";
import "./Dashboard.css";
import {
  Flame,
  Trophy,
  Play,
  Zap,
  Activity,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Stethoscope,
  Microscope,
  Database,
  HeartPulse,
  Scissors,
  Eye,
  Syringe,
  Baby,
  Shield,
  Dna,
  FlaskConical,
  Thermometer,
  ShieldAlert,
  Search
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [questionsToday, setQuestionsToday] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedChallengeSubjects, setSelectedChallengeSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [universalDifficulty, setUniversalDifficulty] = useState("mixed");

  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (location.state?.sessionSaved) {
      setToastMessage("Progress Saved! Take a break and resume anytime.");
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    } else if (location.state?.completedSession) {
      setToastMessage("Session Completed! Your stats have been updated.");
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) return;

      const lastDate = profileData.last_study_date ? new Date(profileData.last_study_date).toDateString() : null;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      setUserName(profileData.full_name?.split(' ')[0] || "Doctor");
      const isStreakActive = lastDate === today || lastDate === yesterday;
      setStreak(isStreakActive ? (profileData.current_streak || 0) : 0);
      setLongestStreak(profileData.longest_streak || 0);
      setQuestionsToday(lastDate === today ? (profileData.questions_today || 0) : 0);
      setRecentActivity(profileData.recent_activity || []);
    };
    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data: subData, error } = await supabase
        .from("subjects")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && subData) {
        // Fetch total question count for each subject to calculate true mastery
        const subjectsWithCounts = await Promise.all(subData.map(async (s) => {
          const { count } = await supabase
            .from("flashcards")
            .select("*", { count: 'exact', head: true })
            .eq("subject_id", s.id);
          return { ...s, total_questions: count || 0 };
        }));
        setSubjects(subjectsWithCounts);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  const handleStartStudy = (subjectId) => {
    const targetSubject = subjectId || selectedSubject;
    if (!targetSubject) return;

    const selectedSubjectName = subjects.find((s) => s.id === targetSubject)?.name || "Unknown";
    navigate("/flashcard", {
      state: {
        subject: targetSubject,
        subjectName: selectedSubjectName,
        difficulty: selectedDifficulty,
        mode: "premium",
      },
    });
  };

  const handleChallengeMode = () => {
    if (selectedChallengeSubjects.length === 0) return;
    navigate("/flashcard", {
      state: {
        subject: selectedChallengeSubjects,
        difficulty: "mixed",
        mode: "challenge",
      },
    });
  };

  const handleUniversalStudy = () => {
    navigate("/flashcard", {
      state: {
        subject: "mixed", // "mixed" triggers all subjects in Flashcard.jsx
        difficulty: universalDifficulty,
        mode: "universal",
      },
    });
  };

  const getSubjectIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('anatomy')) return <Stethoscope size={24} />;
    if (n.includes('physiology')) return <HeartPulse size={24} />;
    if (n.includes('biochem')) return <Dna size={24} />;
    if (n.includes('pathology')) return <FlaskConical size={24} />;
    if (n.includes('pharmacol')) return <Syringe size={24} />;
    if (n.includes('microbiology')) return <Microscope size={24} />;
    if (n.includes('forensic')) return <ShieldAlert size={24} />;
    if (n.includes('community') || n.includes('psm')) return <Shield size={24} />;
    if (n.includes('internal medicine') || (n.includes('medicine') && !n.includes('forensic'))) return <Activity size={24} />;
    if (n.includes('surgery')) return <Scissors size={24} />;
    if (n.includes('pediatrics')) return <Baby size={24} />;
    if (n.includes('ophthal')) return <Eye size={24} />;
    if (n.includes('ent') || n.includes('oto')) return <Thermometer size={24} />;
    if (n.includes('obg') || n.includes('gyn') || n.includes('obstetrics')) return <Baby size={24} />;
    if (n.includes('ortho')) return <Activity size={24} />;
    if (n.includes('derma')) return <Activity size={24} />;
    if (n.includes('psychiatry')) return <Brain size={24} />;
    if (n.includes('neuro')) return <Brain size={24} />;
    if (n.includes('radio')) return <Database size={24} />;
    if (n.includes('anaesthesia')) return <Thermometer size={24} />;
    return <Database size={24} />;
  };

  const getSubjectImage = (name) => {
    const n = name.toLowerCase();

    // Core Sciences1000
    if (n.includes('anatomy')) return 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('physiology')) return 'https://images.unsplash.com/photo-1674702693637-330943cdf0a1?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('biochem')) return 'https://images.unsplash.com/photo-1748261347768-a32434751a9a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // Para-clinical
    if (n.includes('patho')) return 'https://images.unsplash.com/photo-1614308460927-5024ba2e1dcb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('pharm')) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('micro')) return 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('foren')) return 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000';

    // Clinical - Major
    if (n.includes('internal medicine') || (n.includes('medicine') && !n.includes('forensic') && !n.includes('community'))) return 'https://plus.unsplash.com/premium_photo-1661770160867-2c3a5092ec3b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('surg')) return 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('obg') || n.includes('gyn') || n.includes('obstetrics')) return 'https://plus.unsplash.com/premium_photo-1661606400554-a2055d50ee08?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('ped')) return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000';

    // Specialities
    if (n.includes('ophthal') || n.includes('eye')) return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('ent') || n.includes('oto')) return 'https://plus.unsplash.com/premium_photo-1673958772197-b490555f66c1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('ortho')) return 'https://plus.unsplash.com/premium_photo-1726880466207-d85def51628f?q=80&w=1136&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    if (n.includes('derm')) return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('psych')) return 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('radio')) return 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('anaes')) return 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('neuro')) return 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('community') || n.includes('psm')) return 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000';

    // Default medical/clinical background
    return 'https://plus.unsplash.com/premium_photo-1681996348432-1be4193201f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  };

  return (
    <div className="dashboard-page">
      <div className="auth-mesh"></div>
      <Navbar />

      {showToast && (
        <div className="save-toast">
          <Zap size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="dashboard-main">
        {/* Futuristic Hero Section */}
        <section className="command-hero">
          <div className="hero-mesh-overlay"></div>
          <div className="hero-left">
            <h1>Welcome <span className="text-gradient">Back</span></h1>
            <p className="hero-p">Good morning, <span className="doctor-name">Dr. {userName}</span></p>

            <div className="hero-stats-row">
              <div className="mini-stat-glass">
                <div className="stat-icon-wrap orange">
                  <Flame size={18} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{streak}d</span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>
              <div className="mini-stat-glass">
                <div className="stat-icon-wrap blue">
                  <Target size={18} />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{questionsToday}</span>
                  <span className="stat-label">Solved Today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hologram-visual">
              <div className="radar-sweep"></div>
              <div className="hologram-rings">
                <div className="h-ring r-1"></div>
                <div className="h-ring r-2"></div>
                <div className="h-ring r-3"></div>
              </div>
              <div className="hologram-core">
                <HeartPulse size={90} strokeWidth={1} className="heart-beat-icon" />
                <div className="core-shine"></div>
              </div>
              {/* Floating Data Streams */}
              <div className="data-tag tag-1">BP // 120/80</div>
              <div className="data-tag tag-2">HR // 72 BPM</div>
              <div className="data-tag tag-3">SAT // 98%</div>
              <div className="data-tag tag-4">SYS // ACTIVE</div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid-system">
          {/* Main Panel: Subject Exploration */}
          <div className="main-panel">
            <div className="panel-section-header">
              <div className="title-group">
                <Activity size={20} className="text-blue" />
                <h2>Knowledge Domains</h2>
              </div>
              <div className="header-actions">
                <div className="search-bar-glass">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="difficulty-toggle-compact">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`toggle-btn ${selectedDifficulty === level ? 'active' : ''} ${level}`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="subject-card-grid">
              {subjects
                .filter(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((sub, idx) => (
                  <div
                    key={sub.id}
                    className={`subject-module-card ${selectedSubject === sub.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSubject(sub.id)}
                    onDoubleClick={() => handleStartStudy(sub.id)}
                    style={{
                      backgroundImage: `url(${getSubjectImage(sub.name)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="card-glass-overlay"></div>
                    <div className="card-content-relative">
                      <div className="card-top">
                        <div className="card-icon-hex">
                          {getSubjectIcon(sub.name)}
                        </div>
                        <div className="card-badge">ACTIVE</div>
                      </div>
                      <div className="card-info">
                        <h3>{sub.name}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="mini-progress">
                          <div className="bar" style={{
                            width: `${(() => {
                              const subjectActivities = recentActivity.filter(act => act.subject === sub.name);
                              const totalAttempted = subjectActivities.reduce((sum, act) => sum + (act.questions || 0), 0);
                              const progress = sub.total_questions > 0
                                ? Math.min((totalAttempted / sub.total_questions) * 100, 100)
                                : 0;
                              return Math.round(progress);
                            })()}%`
                          }}></div>
                        </div>
                        <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); handleStartStudy(sub.id); }}>
                          <Play size={14} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {subjects.filter(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="no-subjects-found">
                  <p>No subjects match your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Intelligence & Activity */}
          <div className="side-panel">
            {/* Challenge Mode Widget */}
            <div className="challenge-premium-widget">
              <div className="widget-head">
                <Zap size={18} className="text-yellow" />
                <h3>RAPID FIRE CHALLENGE</h3>
              </div>
              <p className="widget-p">Mix subjects and test your reflexes.</p>
              <div className="multi-select-box">
                <Select
                  isMulti
                  options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                  value={subjects.filter(s => selectedChallengeSubjects.includes(s.id)).map(s => ({ value: s.id, label: s.name }))}
                  onChange={(selected) => setSelectedChallengeSubjects(selected.map(opt => opt.value))}
                  placeholder="Search subjects..."
                  styles={customSelectStyles}
                />
              </div>
              <button onClick={handleChallengeMode} className="challenge-launch-btn">
                Launch Challenge
              </button>
            </div>

            {/* Universal Study Widget */}
            <div className="challenge-premium-widget universal-study">
              <div className="widget-head">
                <BookOpen size={18} className="text-indigo" />
                <h3>UNIVERSAL STUDY</h3>
              </div>
              <p className="widget-p">Study all subjects at your preferred difficulty level.</p>

              <div className="difficulty-grid-universal">
                {['easy', 'medium', 'hard', 'mixed'].map(level => (
                  <button
                    key={level}
                    onClick={() => setUniversalDifficulty(level)}
                    className={`univ-diff-btn ${universalDifficulty === level ? 'active' : ''} ${level}`}
                  >
                    {level === 'mixed' ? 'ALL' : level.toUpperCase()}
                  </button>
                ))}
              </div>

              <button onClick={handleUniversalStudy} className="challenge-launch-btn universal-btn">
                Begin Universal Session
              </button>
            </div>

            {/* Subject Mastery Sidebar */}
            <div className="mastery-widget">
              <div className="widget-head">
                <TrendingUp size={18} className="text-blue" />
                <h3>SUBJECT MASTERY</h3>
              </div>

              <div className="mastery-list">
                {(() => {
                  const activeSubjects = subjects.map(sub => {
                    const subjectActivities = recentActivity.filter(act => act.subject === sub.name);
                    if (subjectActivities.length === 0) return null;

                    // Calculate "True" Mastery: Weighted Accuracy * Experience Factor
                    let totalCorrect = 0;
                    let totalAttempted = 0;

                    subjectActivities.forEach(act => {
                      const qCount = act.questions || 0;
                      const acc = act.accuracy || 0;
                      totalAttempted += qCount;
                      totalCorrect += (acc / 100) * qCount;
                    });

                    const rawAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

                    // Calculate mastery based on total questions available in the subject
                    // Percentage = (questions attempted / total questions in subject) * accuracy
                    const totalQuestionsInSubject = sub.total_questions || 1; // Avoid division by zero
                    const coverageFactor = Math.min(totalAttempted / totalQuestionsInSubject, 1);
                    const masteryScore = Math.round(rawAccuracy * coverageFactor);

                    return { name: sub.name, accuracy: masteryScore };
                  })
                    .filter(Boolean)
                    .sort((a, b) => b.accuracy - a.accuracy)
                    .slice(0, 4);

                  if (activeSubjects.length === 0) {
                    return (
                      <div className="empty-mastery" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        <p style={{ margin: 0 }}>Complete a session to unlock mastery stats.</p>
                      </div>
                    );
                  }

                  return activeSubjects.map((item, i) => (
                    <div key={i} className="mastery-item">
                      <div className="mastery-label">
                        <span>{item.name}</span>
                        <span>{item.accuracy}%</span>
                      </div>
                      <div className="mastery-bar-bg">
                        <div
                          className="mastery-bar-fill"
                          style={{
                            width: `${item.accuracy}%`,
                            background: `linear-gradient(to right, #2563eb, ${['#38bdf8', '#818cf8', '#22c55e', '#facc15'][i % 4]})`
                          }}
                        ></div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Recent Intelligence History */}
            <div className="intelligence-history">
              <div className="widget-head">
                <Clock size={18} className="text-blue" />
                <h3>RECENT MISSIONS</h3>
              </div>
              <div className="intel-list">
                {recentActivity.length > 0 ? (
                  recentActivity
                    .filter(activity => (activity.questions || 0) > 0)
                    .slice(0, 4)
                    .map((activity, index) => (
                      <div key={index} className="intel-item">
                        <div className="intel-icon">⚡</div>
                        <div className="intel-data">
                          <span className="intel-subject">{activity.subject}</span>
                          <span className="intel-meta">{activity.questions} cards • {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="intel-empty">
                    <p>Start a mission to build history.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '12px',
    padding: '4px',
    color: '#0f172a',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    '&:hover': { borderColor: '#38bdf8' }
  }),
  menu: (base) => ({
    ...base,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 100,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isSelected ? '#2563eb' : isFocused ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    color: isSelected ? 'white' : isFocused ? '#2563eb' : '#64748b',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  }),
  multiValue: (base) => ({
    ...base,
    background: 'rgba(37, 99, 235, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(37, 99, 235, 0.15)'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '0.75rem'
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#2563eb',
    '&:hover': { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }
  }),
  input: (base) => ({ ...base, color: '#0f172a' }),
  placeholder: (base) => ({ ...base, color: '#2563eb', fontWeight: '600', fontSize: '0.85rem' })
};

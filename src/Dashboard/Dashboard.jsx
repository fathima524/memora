import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";
import { supabase } from "../supabase/supabaseClient";
import Select from "react-select";
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
                  recentActivity.slice(0, 4).map((activity, index) => (
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .dashboard-page {
          min-height: 100vh;
          background: #060912;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 60%);
          z-index: 0;
          pointer-events: none;
        }

        .dashboard-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 120px 2.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        /* Command Hero Section */
        .command-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3.5rem 4.5rem;
          margin-bottom: 3.5rem;
          color: white;
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(56, 189, 248, 0.15) 100%);
          border-radius: 56px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(32px);
          box-shadow: 
            0 50px 140px -30px rgba(0, 0, 0, 0.6),
            inset 0 1px 4px rgba(255, 255, 255, 0.2);
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-mesh-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.3;
          z-index: 0;
        }

        .hero-left { position: relative; z-index: 2; flex: 1; }

        .hero-welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(248, 250, 252, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          color: #f1f5f9;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          width: 8px; height: 8px;
          background: #38bdf8;
          border-radius: 50%;
          box-shadow: 0 0 10px #38bdf8;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }

        .command-hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -3px;
          margin-bottom: 0.5rem;
          line-height: 1;
          color: white;
          text-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .hero-p {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 500px;
          margin-bottom: 1.5rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .hero-stats-row {
          display: flex;
          gap: 1.5rem;
        }

        .mini-stat-glass {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(10, 15, 28, 0.4);
          padding: 0.75rem 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          transition: 0.3s;
        }

        .mini-stat-glass:hover {
          background: rgba(10, 15, 28, 0.6);
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-icon-wrap.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
        .stat-icon-wrap.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }

        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.1rem; font-weight: 800; color: white; line-height: 1; }
        .stat-label { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 2px; }

        /* Hero Right Visual: Hologram Scanner */
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          perspective: 1000px;
        }

        .hologram-visual {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotateX(10deg) rotateY(-10deg);
        }

        .radar-sweep {
          position: absolute;
          inset: 0;
          background: conic-gradient(from 0deg, rgba(56, 189, 248, 0.2) 0deg, transparent 90deg);
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.05);
          animation: sweep 4s linear infinite;
        }

        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .h-ring {
          position: absolute;
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 50%;
          transition: 0.5s;
        }
        .r-1 { width: 120px; height: 120px; border-style: dashed; }
        .r-2 { width: 180px; height: 180px; border-width: 2px; opacity: 0.4; }
        .r-3 { width: 240px; height: 240px; border-style: dotted; opacity: 0.2; }

        .hologram-core {
          position: relative;
          z-index: 10;
          color: #38bdf8;
          filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4));
        }

        .heart-beat-icon {
          animation: heart-pulse 1.2s ease-in-out infinite;
        }

        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 25px rgba(239, 68, 68, 0.3)); color: #fb7185; }
        }

        .core-shine {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 80%);
          filter: blur(35px);
          z-index: -1;
        }

        .data-tag {
          position: absolute;
          padding: 0.4rem 0.8rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.7rem;
          color: #38bdf8;
          backdrop-filter: blur(5px);
          white-space: nowrap;
          animation: float-tag 4s infinite ease-in-out;
        }

        .tag-1 { top: 10%; right: 10%; animation-delay: 0s; }
        .tag-2 { bottom: 20%; left: 0%; animation-delay: 1s; }
        .tag-3 { top: 30%; left: -10%; animation-delay: 2s; }
        .tag-4 { bottom: 5%; right: -5%; animation-delay: 3s; color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }

        @keyframes float-tag {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }

        .text-orange { color: #f97316; }
        .text-blue { color: #38bdf8; }
        .text-yellow { color: #facc15; }
        .text-indigo { color: #818cf8; }
        .text-up { color: #22c55e; font-weight: 700; }
        .doctor-name { color: #38bdf8; font-weight: 700; }
        .text-gradient {
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Grid System */
        .dashboard-grid-system {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
        }

        .panel-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .title-group { display: flex; align-items: center; gap: 0.75rem; }
        .title-group h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; margin: 0; }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .search-bar-glass {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.5rem 1rem;
          gap: 0.75rem;
          transition: 0.3s;
          width: 240px;
        }

        .search-bar-glass:focus-within {
          background: rgba(255, 255, 255, 0.08);
          border-color: #38bdf8;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
          width: 280px;
        }

        .search-icon { color: #64748b; }
        .search-bar-glass input {
          background: transparent;
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          width: 100%;
        }
        .search-bar-glass input::placeholder { color: #475569; }

        .difficulty-toggle-compact {
          display: flex;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 9px;
          cursor: pointer;
          transition: 0.2s;
        }

        .toggle-btn.active.easy { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .toggle-btn.active.medium { background: rgba(234, 179, 8, 0.1); color: #eab308; }
        .toggle-btn.active.hard { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .no-subjects-found {
          grid-column: 1 / -1;
          padding: 4rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 28px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          color: #64748b;
        }

        /* Subject Card Grid */
        .subject-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .subject-module-card {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          padding: 1.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .card-glass-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(1.5px);
          z-index: 1;
          transition: 0.3s;
        }

        .subject-module-card:hover .card-glass-overlay {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(1px);
        }

        .card-content-relative {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .subject-module-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(37, 99, 235, 0.4);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .card-icon-hex {
          width: 50px; height: 50px;
          background: rgba(37, 99, 235, 0.1);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: #2563eb;
          transition: 0.3s;
        }

        .subject-module-card:hover .card-icon-hex {
          transform: rotate(-10deg) scale(1.1);
          background: #2563eb;
          color: white;
        }

        .card-badge {
          font-size: 0.6rem;
          font-weight: 800;
          color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
        }

        .card-info h3 { font-size: 1.15rem; font-weight: 800; margin-bottom: 1.5rem; color: #ffffff; }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mini-progress {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .mini-progress .bar { height: 100%; background: #2563eb; border-radius: 3px; }

        .card-play-btn {
          width: 32px; height: 32px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .card-play-btn:hover { background: #2563eb; color: white; transform: scale(1.1); }

        /* Side Panel Widgets - Off-White Premium Theme */
        .challenge-premium-widget, .mastery-widget, .intelligence-history {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 32px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 
            0 20px 50px -10px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s;
        }

        .challenge-premium-widget:hover, .mastery-widget:hover, .intelligence-history:hover {
          transform: translateY(-5px);
          border-color: #e2e8f0;
        }

        .widget-head { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem; }
        .widget-head h3 { 
          font-size: 0.9rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 1.5px; 
          color: #1e293b; 
          margin: 0;
        }

        .widget-p { 
          font-size: 0.85rem; 
          color: #64748b; 
          margin-bottom: 1.5rem; 
          line-height: 1.4;
          font-weight: 500;
        }
        .multi-select-box { margin-bottom: 1.5rem; }

        .challenge-launch-btn {
          width: 100%;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #2563eb;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .challenge-launch-btn:hover {
          background: #2563eb;
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5);
          transform: scale(1.02);
        }

        .universal-study {
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%) !important;
          border-color: #e2e8f0 !important;
        }

        .universal-study::after {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(129, 140, 248, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .difficulty-grid-universal {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .univ-diff-btn {
          padding: 0.85rem;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .univ-diff-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e0;
        }

        .univ-diff-btn.active.easy { background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: #22c55e; }
        .univ-diff-btn.active.medium { background: rgba(234, 179, 8, 0.1); color: #eab308; border-color: #eab308; }
        .univ-diff-btn.active.hard { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; }
        .univ-diff-btn.active.mixed { background: rgba(37, 99, 235, 0.1); color: #2563eb; border-color: #2563eb; }

        .universal-btn {
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
          color: white;
          border: none;
          position: relative;
          z-index: 1;
        }

        .universal-btn:hover {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.5);
        }

        .mastery-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .mastery-item { display: flex; flex-direction: column; gap: 0.6rem; }
        .mastery-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 0.5px; }
        
        .mastery-bar-bg { height: 10px; background: #f1f5f9; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; }
        .mastery-bar-fill { height: 100%; border-radius: 4px; }

        .intel-list { display: flex; flex-direction: column; gap: 1rem; }
        .intel-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 1.25rem; background: #ffffff;
          border-radius: 24px; border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }
        .intel-item:hover { 
          border-color: rgba(56, 189, 248, 0.3); 
          background: rgba(56, 189, 248, 0.05); 
          transform: translateX(8px);
        }

        .intel-icon { font-size: 1.25rem; filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.4)); }
        .intel-data { display: flex; flex-direction: column; gap: 2px; }
        .intel-subject { font-size: 0.9rem; font-weight: 800; color: #1e293b; }
        .intel-meta { font-size: 0.7rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

        .intel-empty { text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.85rem; font-style: italic; }

        @media (max-width: 1200px) {
          .dashboard-grid-system { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .command-hero { flex-direction: column; padding: 2rem; text-align: center; }
          .hero-left { margin-bottom: 2rem; }
          .hero-stats-row { justify-content: center; }
          .command-hero h1 { font-size: 2.5rem; }
          .subject-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>
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

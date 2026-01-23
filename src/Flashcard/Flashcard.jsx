import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { Clock } from "lucide-react";

export default function Flashcard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, difficulty, mode } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [spacedQueue, setSpacedQueue] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // SRS Configuration
  const SRS_RULES = {
    correct: { easy: 25, medium: 20, hard: 18 },
    incorrect: {
      easy: { once: 15, twicePlus: 12 },
      medium: { once: 12, twicePlus: 8 },
      hard: { once: 10, twicePlus: 5 }
    }
  };

  useEffect(() => {
    const initSession = async () => {
      // ... (rest of the logic stays the same)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      setUser(user);

      const [profileRes, subjectsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("subjects").select("*")
      ]);

      if (profileRes.data) setStreak(profileRes.data.current_streak || 0);
      if (subjectsRes.data) setSubjects(subjectsRes.data);

      const sessionKey = `memora_session_${subject}_${difficulty}`;
      const savedSession = localStorage.getItem(sessionKey);

      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setResumeData(parsed);
        setShowResumeModal(true);
        setLoading(false);
        return;
      }

      let query = supabase.from("flashcards").select("*");
      if (mode === "challenge") {
        if (Array.isArray(subject)) query = query.in("subject_id", subject);
      } else if (subject && subject !== "mixed") {
        query = query.eq("subject_id", subject);
      }

      if (difficulty && difficulty !== "mixed") {
        query = query.eq("difficulty", difficulty);
      }

      const { data: qs, error } = await query;
      if (error || !qs?.length) {
        setLoading(false);
        return;
      }

      // Explicitly clean fresh questions to ensure no phantom properties
      const cleaned = qs.map(q => ({ ...q, _isRepeat: false, _wrongCount: 0 }));
      setQuestions(shuffle(cleaned));
      setLoading(false);
    };

    initSession();
  }, [subject, difficulty, mode, navigate]);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const handleReveal = () => setIsFlipped(true);

  const handleGrade = (isCorrect) => {
    const currentQ = questions[currentIdx];
    if (!currentQ) return;

    // Update Stats
    if (isCorrect) setScore(s => s + 1);

    // Spaced Repetition Logic
    const diff = currentQ.difficulty?.toLowerCase() || 'medium';
    let interval;
    let newWrongCount = currentQ._wrongCount || 0;

    if (isCorrect) {
      interval = SRS_RULES.correct[diff] || 20;
    } else {
      newWrongCount += 1;
      const stage = newWrongCount === 1 ? 'once' : 'twicePlus';
      interval = SRS_RULES.incorrect[diff][stage] || 10;
    }

    // If incorrect or first time correct (reinforcement), re-queue
    if (!isCorrect || !currentQ._isRepeat) {
      setSpacedQueue(prev => [...prev, {
        ...currentQ,
        _isRepeat: true,
        _wrongCount: newWrongCount, // Pass the incremented count
        _wasWrong: !isCorrect,
        _reappearAt: currentIdx + interval
      }]);
    }

    moveToNext();
  };

  const moveToNext = () => {
    const nextIdx = currentIdx + 1;

    // 1. Sort the queue by urgency (_reappearAt) and priority (Mistakes first)
    const sortedQueue = [...spacedQueue].sort((a, b) => {
      // Primary: Show cards that were due earliest first
      if (a._reappearAt !== b._reappearAt) return a._reappearAt - b._reappearAt;
      // Secondary: If due at the same time, prioritize Mistakes over Reinforcement
      if (a._wasWrong !== b._wasWrong) return b._wasWrong - a._wasWrong;
      return 0;
    });

    // 2. Check if any question from SRS queue is ready (Interval achieved)
    const readyFromQueue = sortedQueue.find(q => q._reappearAt <= nextIdx);

    // 3. Check if we have reached the end of the actual deck but still have items in queue
    const isAtEnd = nextIdx >= questions.length;
    const forceFromQueue = isAtEnd && sortedQueue.length > 0 ? sortedQueue[0] : null;

    const itemToInfect = readyFromQueue || forceFromQueue;

    if (itemToInfect) {
      // Injected from queue (either naturally or forced because session is ending)
      setQuestions(prev => {
        const newQs = [...prev];
        newQs.splice(nextIdx, 0, itemToInfect);
        return newQs;
      });
      // Remove specific instance from queue
      setSpacedQueue(prev => prev.filter(q => !(q.id === itemToInfect.id && q._reappearAt === itemToInfect._reappearAt)));
      proceed(nextIdx);
    } else if (nextIdx < questions.length) {
      proceed(nextIdx);
    } else {
      setSessionComplete(true);
    }
  };

  const proceed = (idx) => {
    setCurrentIdx(idx);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleResume = () => {
    if (!resumeData) return;
    setQuestions(resumeData.questions);
    setCurrentIdx(resumeData.currentIdx);
    setScore(resumeData.score);
    // Restore the mistake bucket state
    setSpacedQueue(resumeData.spacedQueue || []);
    setShowResumeModal(false);
  };

  const handleStartFresh = async () => {
    const sessionKey = `memora_session_${subject}_${difficulty}`;
    localStorage.removeItem(sessionKey);
    setShowResumeModal(false);
    setLoading(true);

    // Fetch fresh questions
    let query = supabase.from("flashcards").select("*");
    if (mode === "challenge") {
      if (Array.isArray(subject)) query = query.in("subject_id", subject);
    } else if (subject && subject !== "mixed") {
      query = query.eq("subject_id", subject);
    }

    if (difficulty && difficulty !== "mixed") {
      query = query.eq("difficulty", difficulty);
    }

    const { data: qs, error } = await query;
    if (!error && qs?.length) {
      setQuestions(shuffle(qs));
    }
    setLoading(false);
  };

  const saveAndExit = async (isManualExit = false) => {
    if (!user) return;

    // Determine how many NEW questions were answered in this sitting
    // If resuming, we only want to add the difference
    const totalAnsweredAtThisPoint = isManualExit ? currentIdx : questions.length;
    const previouslyCounted = resumeData?.currentIdx || 0;
    const newQuestionsInThisSitting = Math.max(0, totalAnsweredAtThisPoint - previouslyCounted);

    const sessionKey = `memora_session_${subject}_${difficulty}`;

    // If exiting early, save state for resume
    if (isManualExit && totalAnsweredAtThisPoint > 0 && totalAnsweredAtThisPoint < questions.length) {
      const sessionState = {
        questions,
        currentIdx: totalAnsweredAtThisPoint,
        score,
        subject,
        difficulty,
        subjectName: Array.isArray(subject)
          ? "Challenge Mode"
          : subjects.find(s => s.id === subject)?.name || "Study Session",
        spacedQueue,
        timestamp: Date.now()
      };
      localStorage.setItem(sessionKey, JSON.stringify(sessionState));
    } else {
      localStorage.removeItem(sessionKey);
    }

    // If they exit immediately without doing anything, or they haven't answered any NEW cards since last save/resume
    if (isManualExit && (newQuestionsInThisSitting === 0)) {
      navigate("/dashboard");
      return;
    }

    // Update Profile Stats
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile) {
      navigate("/dashboard");
      return;
    }

    const today = new Date().toDateString();
    const lastDate = profile.last_study_date ? new Date(profile.last_study_date).toDateString() : null;

    let newStreak = profile.current_streak || 0;
    let newTodayQs = profile.questions_today || 0;

    if (lastDate === today) {
      newTodayQs += newQuestionsInThisSitting;
    } else {
      newTodayQs = newQuestionsInThisSitting;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      newStreak = lastDate === yesterday ? newStreak + 1 : 1;
    }

    // Prepare Activity Log
    const subName = Array.isArray(subject)
      ? "Challenge Mode"
      : subjects.find(s => s.id === subject)?.name || (subject === "mixed" ? "Mixed Study" : "Study Session");

    const activity = [{
      subject: subName,
      questions: newQuestionsInThisSitting,
      score: isManualExit ? 0 : score, // Only log score if finished, or refine how partial score is logged
      accuracy: newQuestionsInThisSitting > 0 ? Math.round((score / totalAnsweredAtThisPoint) * 100) : 0,
      timestamp: new Date().toISOString()
    }, ...(profile.recent_activity || [])].slice(0, 10);

    await supabase.from("profiles").update({
      current_streak: newStreak,
      questions_today: newTodayQs,
      last_study_date: new Date().toISOString(),
      recent_activity: activity,
      longest_streak: Math.max(newStreak, profile.longest_streak || 0)
    }).eq("id", user.id);

    navigate("/dashboard", {
      state: {
        sessionSaved: isManualExit,
        completedSession: !isManualExit,
        questionsCounted: newQuestionsInThisSitting
      }
    });
  };

  if (loading) return (
    <div className="flashcard-page loading">
      <div className="loader-ring"></div>
      <p>Preparing your Memora session...</p>
      <style>{`
        .flashcard-page.loading { 
          height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; 
          background: #0f172a; color: white; gap: 1.5rem; font-family: sans-serif;
        }
        .loader-ring { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (showResumeModal && resumeData) return (
    <div className="resume-modal-overlay">
      <div className="resume-card">
        <div className="resume-icon-wrap">
          <Clock size={48} className="rotate-icon" />
        </div>
        <h2>Resume Session?</h2>
        <p>You have an unfinished <strong>{resumeData.subjectName}</strong> session from earlier.</p>

        <div className="resume-stats">
          <div className="r-stat">
            <span>Progress</span>
            <strong>Card {resumeData.currentIdx + 1} of {resumeData.questions.length}</strong>
          </div>
          <div className="r-stat">
            <span>Score</span>
            <strong>{resumeData.score}</strong>
          </div>
        </div>

        <div className="resume-actions">
          <button onClick={handleResume} className="btn-resume-primary">
            Resume Study
          </button>
          <button onClick={handleStartFresh} className="btn-resume-secondary">
            Start Fresh
          </button>
        </div>
      </div>
      <style>{`
        .resume-modal-overlay {
          height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center;
          padding: 2rem; color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .resume-card {
          background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.1);
          padding: 3rem 2.5rem; border-radius: 40px; text-align: center; width: 100%; max-width: 480px;
          z-index: 10; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.7);
          animation: modalPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes modalPop { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .resume-icon-wrap { width: 100px; height: 100px; background: rgba(37, 99, 235, 0.1); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: #38bdf8; }
        .rotate-icon { animation: clockRotate 10s linear infinite; }
        @keyframes clockRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .resume-card h2 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -1px; }
        .resume-card p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
        .resume-card strong { color: #f8fafc; }
        .resume-stats { display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 20px; margin-bottom: 2.5rem; }
        .r-stat { display: flex; flex-direction: column; gap: 0.4rem; text-align: left; }
        .r-stat span { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 1px; }
        .r-stat strong { font-size: 1rem; color: #38bdf8; }
        .resume-actions { display: flex; flex-direction: column; gap: 1rem; }
        .btn-resume-primary { width: 100%; padding: 1.25rem; background: #2563eb; color: white; border: none; border-radius: 18px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3); }
        .btn-resume-primary:hover { background: #1d4ed8; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4); }
        .btn-resume-secondary { width: 100%; padding: 1.1rem; background: rgba(255,255,255,0.03); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-resume-secondary:hover { background: rgba(239, 68, 68, 0.05); color: #f87171; border-color: rgba(239, 68, 68, 0.1); }
      `}</style>
    </div>
  );

  if (!questions.length) return (
    <div className="flashcard-page empty">
      <div className="empty-card">
        <h2>No Cards Found</h2>
        <p>We couldn't find any flashcards matching your criteria. Try adjusting the subject or difficulty.</p>
        <button onClick={() => navigate("/dashboard")} className="btn-back">Return to Dashboard</button>
      </div>
      <style>{`.flashcard-page.empty { height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 2rem; color: white; font-family: sans-serif; } .empty-card { background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); padding: 3rem; border-radius: 24px; text-align: center; max-width: 400px; } .btn-back { margin-top: 2rem; padding: 1rem 2rem; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }`}</style>
    </div>
  );

  if (sessionComplete) return (
    <div className="flashcard-page complete">
      <div className="complete-card">
        <span className="trophy">🏆</span>
        <h1>Round Complete!</h1>
        <div className="session-stats">
          <div className="s-item"><span>Cards</span><strong>{questions.length}</strong></div>
          <div className="s-item"><span>Accuracy</span><strong>{Math.round((score / questions.length) * 100)}%</strong></div>
        </div>
        <button onClick={saveAndExit} className="btn-finish">Finish & Save Progress</button>
      </div>
      <style>{`
        .flashcard-page.complete { height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; color: white; font-family: 'Plus Jakarta Sans', sans-serif; }
        .complete-card { background: rgba(30,41,59,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); padding: 4rem 3rem; border-radius: 32px; text-align: center; width: 100%; max-width: 450px; }
        .trophy { font-size: 5rem; display: block; margin-bottom: 2rem; }
        .session-stats { display: flex; justify-content: space-around; margin: 2rem 0 3rem; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 16px; }
        .s-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .s-item span { color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; }
        .s-item strong { font-size: 1.5rem; }
        .btn-finish { width: 100%; padding: 1.25rem; background: #22c55e; color: white; border: none; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
        .btn-finish:hover { background: #16a34a; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3); }
      `}</style>
    </div>
  );

  const currentQ = questions[currentIdx];

  return (
    <div className="flashcard-page study">
      <div className="auth-mesh"></div>
      {/* Session Progress Header */}
      <header className="study-header">
        <div className="header-left">
          <button onClick={() => saveAndExit(true)} className="btn-exit">✕ Exit</button>
          <span className="subject-tag">{subjects.find(s => s.id === subject)?.name || "MBBS Revision"}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
          <span className="progress-text">Card {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className="header-right">
          <span className="score-badge">Accuracy: {score}</span>
        </div>
      </header>

      <main className="card-arena">
        <div className={`study-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-face front">
            <div className="card-meta">
              <span className={`difficulty-indicator ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
              {currentQ._isRepeat && (
                <span className={`repeat-badge ${currentQ._wasWrong ? 'wrong' : 'reinforce'}`}>
                  {currentQ._wasWrong ? 'Needs Practice' : 'Consolidating Concept'}
                </span>
              )}
            </div>

            <div className="question-content">
              {currentQ.image_url && <div className="q-image-wrapper"><img src={currentQ.image_url} alt="Reference" /></div>}
              <h2>{currentQ.question}</h2>
            </div>

            <div className="card-footer-hint">
              {showHint && <p className="hint-text">💡 {currentQ.hint || "No hint available for this card."}</p>}
              {!showHint && currentQ.hint && <button onClick={() => setShowHint(true)} className="btn-hint-toggle">Show Hint</button>}
            </div>

            <button onClick={handleReveal} className="btn-reveal">Reveal Answer</button>
          </div>

          <div className="card-face back">
            <div className="answer-content">
              <div className="ans-header">COMPLETED ANSWER</div>
              {currentQ.answer_image_url && <div className="q-image-wrapper"><img src={currentQ.answer_image_url} alt="Answer Reference" /></div>}
              <h3>{currentQ.correct}</h3>
              {currentQ.explanation && (
                <div className="explanation-box">
                  <header>Explanation</header>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>

            <div className="grading-actions">
              <button onClick={() => handleGrade(false)} className="btn-grade red">
                <span>Mistake</span>
                <div className="key-hint">✕</div>
              </button>
              <button onClick={() => handleGrade(true)} className="btn-grade green">
                <span>Mastered</span>
                <div className="key-hint">✓</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .flashcard-page.study {
          min-height: 100vh; background: #0f172a; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; flex-direction: column;
          position: relative; overflow-y: auto;
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

        .study-header {
          padding: 1.5rem 2.5rem; display: flex; justify-content: space-between; align-items: center;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky; top: 0;
        }

        .btn-exit { 
          padding: 0.6rem 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; font-weight: 700; cursor: pointer; border-radius: 12px; transition: 0.2s;
        }
        .btn-exit:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.2); }

        .subject-tag { margin-left: 1.5rem; background: rgba(37, 99, 235, 0.15); color: #38bdf8; padding: 0.45rem 1.25rem; border-radius: 99px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

        .progress-container { flex: 1; max-width: 450px; padding: 0 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
        .progress-bar { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(to right, #2563eb, #38bdf8); transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 0 15px rgba(37, 99, 235, 0.3); }
        .progress-text { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        .score-badge { font-weight: 800; color: #22c55e; background: rgba(34, 197, 94, 0.1); padding: 0.5rem 1.25rem; border-radius: 14px; font-size: 0.9rem; border: 1px solid rgba(34, 197, 94, 0.15); }

        .card-arena { 
          flex: 1; display: flex; align-items: flex-start; justify-content: center; 
          padding: 2rem; position: relative; z-index: 10;
        }

        .study-card {
          width: 100%; max-width: 760px; min-height: 600px; position: relative;
          perspective: 2000px; transform-style: preserve-3d;
        }

        .card-face {
          position: absolute; width: 100%; height: 100%;
          background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 40px;
          padding: 2rem 2.5rem; display: flex; flex-direction: column;
          backface-visibility: hidden; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .card-face::-webkit-scrollbar { width: 6px; }
        .card-face::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .study-card.flipped .front { transform: rotateY(180deg); }
        .study-card.flipped .back { transform: rotateY(0deg); }
        .back { transform: rotateY(-180deg); }

        .card-meta { display: flex; justify-content: space-between; margin-bottom: 1.25rem; }
        .difficulty-indicator { text-transform: uppercase; font-size: 0.7rem; font-weight: 900; padding: 0.35rem 1rem; border-radius: 8px; letter-spacing: 1px; }
        .difficulty-indicator.easy { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
        .difficulty-indicator.medium { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.2); }
        .difficulty-indicator.hard { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
        
        .repeat-badge { padding: 0.35rem 1rem; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; }
        .repeat-badge.wrong { background: #f97316; color: white; }
        .repeat-badge.reinforce { background: #8b5cf6; color: white; }

        .question-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .question-content h2 { font-size: 1.7rem; line-height: 1.4; font-weight: 800; margin: 0; letter-spacing: -1px; }
        .q-image-wrapper { margin-bottom: 1rem; width: 100%; max-height: 260px; overflow: hidden; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .q-image-wrapper img { width: 100%; height: 100%; object-fit: contain; background: rgba(0,0,0,0.2); }

        .btn-reveal {
          width: 100%; padding: 1.25rem; background: #2563eb; color: white;
          border: none; border-radius: 18px; font-weight: 800; font-size: 1.15rem;
          cursor: pointer; margin-top: 1.5rem; transition: 0.3s;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
          flex-shrink: 0;
        }
        .btn-reveal:hover { background: #1d4ed8; transform: translateY(-3px); box-shadow: 0 20px 35px -5px rgba(37, 99, 235, 0.5); }

        .card-footer-hint { min-height: 50px; display: flex; align-items: center; justify-content: center; margin-top: 0.5rem; }
        .hint-text { font-style: italic; color: #94a3b8; font-size: 0.9rem; text-align: center; background: rgba(255,255,255,0.03); padding: 0.75rem 1.5rem; border-radius: 12px; }
        .btn-hint-toggle { background: none; border: none; color: #64748b; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: 0.2s; }
        .btn-hint-toggle:hover { color: #38bdf8; }

        .ans-header { font-size: 0.75rem; font-weight: 900; color: #64748b; letter-spacing: 3px; margin-bottom: 1.25rem; text-transform: uppercase; }
        .answer-content { flex: 1; text-align: center; }
        .answer-content h3 { font-size: 1.6rem; color: #4ade80; margin-bottom: 1.25rem; line-height: 1.3; font-weight: 800; }
        
        .explanation-box { background: rgba(15, 23, 42, 0.4); border-radius: 22px; padding: 1.5rem; text-align: left; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; }
        .explanation-box header { font-weight: 900; font-size: 0.75rem; color: #38bdf8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; }
        .explanation-box p { font-size: 0.95rem; color: #cbd5e0; line-height: 1.6; margin: 0; }

        .grading-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem; flex-shrink: 0; }
        .btn-grade {
          display: flex; flex-direction: column; align-items: center; gap: 0.875rem;
          padding: 1.25rem; border: none; border-radius: 24px; color: white; font-weight: 800;
          cursor: pointer; transition: 0.3s;
        }
        .btn-grade.red { background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); color: #f87171; }
        .btn-grade.red:hover { background: #ef4444; color: white; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3); }
        .btn-grade.green { background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.15); color: #4ade80; }
        .btn-grade.green:hover { background: #22c55e; color: white; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3); }
        
        .key-hint { 
          width: 36px; height: 36px; background: rgba(255,255,255,0.05); 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 10px; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.05);
        }

        @media (max-width: 768px) {
          .study-header { padding: 1rem 1.5rem; }
          .subject-tag { display: none; }
          .progress-container { padding: 0 1.5rem; }
          .progress-text { font-size: 0.65rem; }
          .score-badge { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
          .card-arena { padding: 1.5rem 1rem; }
          .study-card { min-height: 500px; }
          .card-face { padding: 1.5rem; border-radius: 24px; }
          .question-content h2 { font-size: 1.4rem; }
          .q-image-wrapper { max-height: 220px; }
          .grading-actions { gap: 1rem; }
          .btn-grade { padding: 1rem; border-radius: 16px; }
          .btn-reveal { margin-top: 1.5rem; border-radius: 14px; }
          .answer-content h3 { font-size: 1.3rem; }
          .explanation-box { padding: 1rem; }
        }

        @media (max-width: 480px) {
          .study-header { padding: 0.75rem 1rem; }
          .btn-exit { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
          .progress-container { max-width: 180px; padding: 0 0.5rem; }
          .card-arena { padding: 1rem 0.75rem; }
          .study-card { min-height: 480px; }
          .card-face { padding: 1.25rem; }
          .question-content h2 { font-size: 1.25rem; }
          .q-image-wrapper { max-height: 180px; }
          .grading-actions { gap: 0.75rem; }
          .btn-grade { font-size: 0.9rem; }
          .key-hint { display: none; }
          .ans-header { margin-bottom: 1rem; font-size: 0.65rem; }
        }

      `}</style>
    </div>
  );
}
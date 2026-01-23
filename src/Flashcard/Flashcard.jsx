import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { Clock } from "lucide-react";
import "./Flashcard.css";

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

    if (isCorrect) setScore(s => s + 1);

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

    if (!isCorrect || !currentQ._isRepeat) {
      setSpacedQueue(prev => [...prev, {
        ...currentQ,
        _isRepeat: true,
        _wrongCount: newWrongCount,
        _wasWrong: !isCorrect,
        _reappearAt: currentIdx + interval
      }]);
    }

    moveToNext();
  };

  const moveToNext = () => {
    const nextIdx = currentIdx + 1;

    const sortedQueue = [...spacedQueue].sort((a, b) => {
      if (a._reappearAt !== b._reappearAt) return a._reappearAt - b._reappearAt;
      if (a._wasWrong !== b._wasWrong) return b._wasWrong - a._wasWrong;
      return 0;
    });

    const readyFromQueue = sortedQueue.find(q => q._reappearAt <= nextIdx);
    const isAtEnd = nextIdx >= questions.length;
    const forceFromQueue = isAtEnd && sortedQueue.length > 0 ? sortedQueue[0] : null;

    const itemToInfect = readyFromQueue || forceFromQueue;

    if (itemToInfect) {
      setQuestions(prev => {
        const newQs = [...prev];
        newQs.splice(nextIdx, 0, itemToInfect);
        return newQs;
      });
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
    setSpacedQueue(resumeData.spacedQueue || []);
    setShowResumeModal(false);
  };

  const handleStartFresh = async () => {
    const sessionKey = `memora_session_${subject}_${difficulty}`;
    localStorage.removeItem(sessionKey);
    setShowResumeModal(false);
    setLoading(true);

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

    const totalAnsweredAtThisPoint = isManualExit ? currentIdx : questions.length;
    const previouslyCounted = resumeData?.currentIdx || 0;
    const newQuestionsInThisSitting = Math.max(0, totalAnsweredAtThisPoint - previouslyCounted);

    const sessionKey = `memora_session_${subject}_${difficulty}`;

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

    if (newQuestionsInThisSitting === 0) {
      navigate("/dashboard", {
        state: { sessionSaved: isManualExit, completedSession: !isManualExit },
        replace: true
      });
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!profile) {
      navigate("/dashboard", { state: { sessionSaved: isManualExit }, replace: true });
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

    let activity = profile.recent_activity || [];
    const subName = Array.isArray(subject)
      ? "Challenge Mode"
      : subjects.find(s => s.id === subject)?.name || (subject === "mixed" ? "Mixed Study" : "Study Session");

    const newEntry = {
      subject: subName,
      questions: newQuestionsInThisSitting,
      score: isManualExit ? 0 : score,
      accuracy: Math.round((score / (totalAnsweredAtThisPoint || 1)) * 100),
      timestamp: new Date().toISOString()
    };
    activity = [newEntry, ...activity].slice(0, 10);

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
      },
      replace: true
    });
  };

  if (loading) return (
    <div className="flashcard-page loading">
      <div className="loader-ring"></div>
      <p>Preparing your Memora session...</p>
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
            <strong className="card-accent-val">Card {resumeData.currentIdx + 1} of {resumeData.questions.length}</strong>
          </div>
          <div className="r-stat">
            <span>Score</span>
            <strong className="card-accent-val">{resumeData.score}</strong>
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
    </div>
  );

  if (!questions.length) return (
    <div className="flashcard-page empty">
      <div className="empty-card">
        <h2>No Cards Found</h2>
        <p>We couldn't find any flashcards matching your criteria. Try adjusting the subject or difficulty.</p>
        <button onClick={() => navigate("/dashboard")} className="btn-back">Return to Dashboard</button>
      </div>
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
    </div>
  );

  const currentQ = questions[currentIdx];

  return (
    <div className="flashcard-page study">
      <div className="auth-mesh"></div>
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
    </div>
  );
}
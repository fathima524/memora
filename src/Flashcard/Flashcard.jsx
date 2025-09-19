import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

function Flashcard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, difficulty, mode } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [spacedRepetitionQueue, setSpacedRepetitionQueue] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUserAndProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) return console.error(userError);
    if (!user) return;

    setUser(user);

    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) return console.error(profileError);
    if (!profileData) return;

    // Populate state
    setStreak(profileData.current_streak || 0);
    setQuestionHistory(profileData.recent_activity || []);
    setTimeLeft(300); // default or any saved value
    // ...any other state you want to restore

    // Optional: sync with localStorage
    localStorage.setItem("currentStreak", (profileData.current_streak || 0).toString());
    localStorage.setItem("recentActivity", JSON.stringify(profileData.recent_activity || []));
  };

  fetchUserAndProfile();
}, []);


  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subjects").select("*");
      if (!error) setSubjects(data);
    };
    fetchSubjects();
  }, []);

  const SPACED_REPETITION_CONFIG = {
    correct: { easy: 15, medium: 20, hard: 25 },
    incorrect: { easy: 3, medium: 5, hard: 7 }
  };

  // Fetch questions - Updated to include image_url
  useEffect(() => {
    const fetchQuestions = async () => {
      let query = supabase.from("flashcards").select("*, image_url");

      if (mode === "challenge") {
        if (subject === "all") {
          // no filter
        } else if (Array.isArray(subject) && subject.length > 0) {
          query = query.in("subject_id", subject);
        }
      } else {
        if (subject && subject !== "mixed") {
          query = query.eq("subject_id", subject);
        }
      }

      if (difficulty && difficulty !== "mixed") {
        query = query.eq("difficulty", difficulty);
      }

      const { data, error } = await query;
      if (error) console.error("Error fetching flashcards:", error);
      else setQuestions(shuffleArray(data));

      setSessionStartTime(Date.now());
    };

    fetchQuestions();
  }, [subject, difficulty, mode]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0) {
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const addToSpacedRepetition = (question, isCorrect) => {
    const reappearAfter =
      SPACED_REPETITION_CONFIG[isCorrect ? "correct" : "incorrect"][question.difficulty];
    setSpacedRepetitionQueue((prev) => [
      ...prev,
      { question, reappearAfter, currentCount: 0, isCorrect, addedAt: Date.now() }
    ]);
  };

  const getNextQuestion = () => {
    const readyQuestions = spacedRepetitionQueue.filter(
      (item) => item.currentCount >= item.reappearAfter
    );
    if (readyQuestions.length > 0) {
      const questionToReturn = readyQuestions[0];
      setSpacedRepetitionQueue((prev) =>
        prev.filter((item) => item !== questionToReturn)
      );
      return questionToReturn.question;
    }
    return currentQuestionIndex < questions.length - 1
      ? questions[currentQuestionIndex + 1]
      : null;
  };

  const handleAnswer = (isCorrect) => {
    setQuestionHistory((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex],
        isCorrect,
        usedHint: showHint,
        timeSpent: 300 - timeLeft
      }
    ]);

    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setStreak((prev) => (isCorrect ? prev + 1 : 0));
    addToSpacedRepetition(questions[currentQuestionIndex], isCorrect);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setSpacedRepetitionQueue((prev) =>
      prev.map((item) => ({ ...item, currentCount: item.currentCount + 1 }))
    );

    const nextQuestion = getNextQuestion();

    if (nextQuestion) {
      const nextIndex = questions.findIndex((q) => q.id === nextQuestion.id);
      if (nextIndex !== -1) setCurrentQuestionIndex(nextIndex);
      else {
        setQuestions((prev) => [...prev, nextQuestion]);
        setCurrentQuestionIndex(questions.length);
      }

      setShowAnswer(false);
      setShowHint(false);
      setTimeLeft(300);
      setIsTimerActive(true);
    } else {
      handleFinishSession();
    }
  };

  const handleFinishSession = async () => {
    if (!user) return;

    const totalQs = questions?.length || 0;

    const sessionData = {
      score,
      totalQuestions: totalQs,
      timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
      subject,
      difficulty,
      spacedRepetitionData: spacedRepetitionQueue,
      mode,
      timestamp: new Date().toISOString()
    };

    // Fetch profile
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("current_streak, questions_today, last_study_date, recent_activity")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    let currentStreak = profileData?.current_streak || 0;
    let questionsToday = profileData?.questions_today || 0;
    let recentActivity = profileData?.recent_activity || [];

    // Streak calculation
    const today = new Date().toDateString();
    const lastStudyDate = profileData?.last_study_date
      ? new Date(profileData.last_study_date).toDateString()
      : null;

    if (lastStudyDate === today) {
      // already studied today
    } else if (lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    questionsToday += totalQs;

    // Update recent activity
    let activityLabel;
    if (mode === "challenge") activityLabel = "Challenge mode";
    else if (subject === "mixed") activityLabel = "Mixed";
    else if (subject === "all") activityLabel = "All Subjects";
    else if (Array.isArray(subject)) activityLabel = "Multiple Subjects";
    else {
      const found = subjects.find((s) => s.id === subject);
      activityLabel = found ? found.name : "Unknown";
    }

    recentActivity.unshift({
      subject: activityLabel,
      questions: totalQs,
      timestamp: new Date().toLocaleString()
    });
    if (recentActivity.length > 4) recentActivity = recentActivity.slice(0, 4);

    // Save back to Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        current_streak: currentStreak,
        questions_today: questionsToday,
        last_study_date: new Date(),
        recent_activity: recentActivity
      })
      .eq("id", user.id);

    if (updateError) console.error("Error updating profile:", updateError);

    // Update localStorage
    localStorage.setItem("currentStreak", currentStreak.toString());
    localStorage.setItem("questionsToday", questionsToday.toString());
    localStorage.setItem("lastStudyDate", today);
    localStorage.setItem("recentActivity", JSON.stringify(recentActivity));
    localStorage.setItem("lastSession", JSON.stringify(sessionData));
    localStorage.setItem(
      "spacedRepetitionQueue",
      JSON.stringify(spacedRepetitionQueue)
    );

    navigate("/dashboard", { state: { completedSession: true, sessionData } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (diff) => {
    const colors = {
      easy: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
      medium: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)",
      hard: "linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)"
    };
    return colors[diff] || colors.easy;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!questions.length) {
    return (
      <div style={styles.noQuestionsContainer}>
        <div style={styles.card}>
          <h2>No questions available</h2>
          <p>Please select a different subject or difficulty level.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.flashcard}>
        <div
          style={{
            ...styles.badge,
            background: getDifficultyColor(currentQuestion?.difficulty)
          }}
        >
          {currentQuestion?.difficulty || "Easy"}
        </div>

        <div style={styles.header}>
          
          <div style={styles.headerItem}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div style={{ ...styles.headerItem, display: "none" }}>🔥 Streak: {streak}</div>
        </div>

        <div style={showAnswer ? styles.cardBack : styles.cardFront}>
          {!showAnswer ? (
            // Question content with optional image
            currentQuestion?.image_url ? (
              <div style={styles.splitLayout}>
                <div style={styles.imageSection}>
                  <img 
                    src={currentQuestion.image_url} 
                    alt="Question illustration"
                    style={styles.questionImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div style={{...styles.imageError, display: 'none'}}>
                    🖼️ Image not available
                  </div>
                </div>
                <div style={styles.textSection}>
                  <h2 style={styles.questionText}>{currentQuestion?.question}</h2>
                </div>
              </div>
            ) : (
              <div style={styles.textOnly}>
                <h2 style={styles.questionText}>{currentQuestion?.question}</h2>
              </div>
            )
          ) : (
            // Answer content
            <>
              <h3 style={styles.answerText}>
                Answer: {currentQuestion?.correct}
              </h3>
              {currentQuestion?.explanation && (
                <p style={styles.explanation}>{currentQuestion.explanation}</p>
              )}
            </>
          )}
        </div>

        {showHint && currentQuestion?.hint && (
          <div style={styles.hint}>
            💡 <strong>Hint:</strong> {currentQuestion.hint}
          </div>
        )}

        <div style={styles.buttonGroup}>
          {!showAnswer ? (
            <>
              {currentQuestion?.difficulty === "hard" &&
                currentQuestion?.hint &&
                !showHint && (
                  <button
                    style={styles.secondaryButton}
                    onClick={() => setShowHint(true)}
                  >
                    💡 Show Hint
                  </button>
                )}
              <button
                style={styles.button}
                onClick={() => {
                  setShowAnswer(true);
                  setIsTimerActive(false);
                }}
              >
                🔍 Show Answer
              </button>
            </>
          ) : (
            <>
              <button
                style={{ ...styles.button, ...styles.success }}
                onClick={() => handleAnswer(true)}
              >
                ✅ I Got It Right
              </button>
              <button
                style={{ ...styles.button, ...styles.danger }}
                onClick={() => handleAnswer(false)}
              >
                ❌ I Got It Wrong
              </button>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: window.innerWidth <= 480 ? "1.2rem" : "1.5rem" }}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/dashboard")}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
          }}
        ></div>
      </div>

      <style>{`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }`}</style>
    </div>
  );
}

// STYLES SECTION - Updated with image support
const styles = {
  container: {
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
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },

  flashcard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    maxWidth: window.innerWidth <= 480 ? '340px' : window.innerWidth <= 768 ? '500px' : '600px',
    width: window.innerWidth <= 480 ? '92%' : window.innerWidth <= 768 ? '90%' : '100%',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    marginBottom: window.innerWidth <= 480 ? '1rem' : '1.5rem',
    position: 'relative',
    margin: '1rem'
  },

  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: window.innerWidth <= 480 ? '2rem' : '2.5rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)',
    maxWidth: window.innerWidth <= 480 ? '320px' : '400px',
    margin: '1rem'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: window.innerWidth <= 480 ? '1.2rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem',
    flexWrap: 'wrap',
    gap: window.innerWidth <= 480 ? '0.5rem' : '0.8rem'
  },

  headerItem: {
    padding: window.innerWidth <= 480 ? '0.6rem 1rem' : window.innerWidth <= 768 ? '0.7rem 1.2rem' : '0.8rem 1.5rem',
    borderRadius: window.innerWidth <= 480 ? '16px' : '18px',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : window.innerWidth <= 768 ? '0.9rem' : '1rem',
    fontWeight: '600',
    background: 'rgba(157, 178, 191, 0.2)',
    color: '#526d82',
    whiteSpace: 'nowrap'
  },

  badge: {
    position: 'absolute',
    top: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    right: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    color: 'white',
    padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem',
    borderRadius: '16px',
    fontSize: window.innerWidth <= 480 ? '0.7rem' : '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },

  cardFront: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '14px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    marginBottom: window.innerWidth <= 480 ? '1.2rem' : '1.5rem',
    border: '2px solid #dde6ed',
    minHeight: window.innerWidth <= 480 ? '140px' : window.innerWidth <= 768 ? '160px' : '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },

  cardBack: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)',
    borderRadius: '14px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    marginBottom: window.innerWidth <= 480 ? '1.2rem' : '1.5rem',
    border: '2px solid #c3e6cb',
    minHeight: window.innerWidth <= 480 ? '140px' : window.innerWidth <= 768 ? '160px' : '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },

  // New styles for split layout
  splitLayout: {
    display: 'flex',
    height: '100%',
    gap: window.innerWidth <= 480 ? '1rem' : '1.5rem',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  imageSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: window.innerWidth <= 480 ? '100px' : '120px',
    maxHeight: window.innerWidth <= 480 ? '120px' : '150px'
  },

  textSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: window.innerWidth <= 480 ? '0.5rem' : '1rem'
  },

  textOnly: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: window.innerWidth <= 480 ? '1rem' : '1.5rem'
  },

  questionImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },

  imageError: {
    color: '#6c757d',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
    textAlign: 'center',
    fontStyle: 'italic'
  },

  questionText: {
    fontSize: window.innerWidth <= 480 ? '1.1rem' : window.innerWidth <= 768 ? '1.2rem' : '1.4rem',
    fontWeight: '600',
    color: '#27374d',
    margin: 0,
    lineHeight: '1.4'
  },

  answerText: {
    fontSize: window.innerWidth <= 480 ? '1rem' : window.innerWidth <= 768 ? '1.1rem' : '1.2rem',
    fontWeight: '600',
    color: '#155724',
    marginBottom: '0.8rem',
    lineHeight: '1.3'
  },

  explanation: {
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    color: '#495057',
    fontStyle: 'italic',
    lineHeight: '1.4'
  },

  buttonGroup: {
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },

  button: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.4rem' : window.innerWidth <= 768 ? '0.9rem 1.6rem' : '1rem 2rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : window.innerWidth <= 768 ? '0.85rem' : '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)',
    minWidth: window.innerWidth <= 480 ? '100px' : '120px',
    whiteSpace: 'nowrap'
  },

  secondaryButton: {
    padding: window.innerWidth <= 480 ? '0.7rem 1.2rem' : window.innerWidth <= 768 ? '0.8rem 1.4rem' : '0.8rem 1.5rem',
    border: '2px solid #9db2bf',
    borderRadius: '10px',
    fontSize: window.innerWidth <= 480 ? '0.75rem' : window.innerWidth <= 768 ? '0.8rem' : '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(157, 178, 191, 0.3)',
    color: '#27374d',
    minWidth: window.innerWidth <= 480 ? '100px' : '120px',
    whiteSpace: 'nowrap'
  },

  success: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },

  danger: {
    background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
  },

  hint: {
    background: 'rgba(255, 193, 7, 0.1)',
    border: '2px solid rgba(255, 193, 7, 0.3)',
    padding: window.innerWidth <= 480 ? '1rem' : '1.2rem',
    borderRadius: '10px',
    marginTop: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    color: '#856404',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem'
  },

  info: {
    marginTop: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    padding: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    background: 'rgba(52, 152, 219, 0.1)',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.85rem',
    color: '#2980b9'
  },

  progressContainer: {
    width: '100%',
    maxWidth: window.innerWidth <= 480 ? '340px' : window.innerWidth <= 768 ? '500px' : '600px',
    height: window.innerWidth <= 480 ? '6px' : '8px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '0 1rem'
  },

  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #27374d 0%, #526d82 50%, #9db2bf 100%)',
    transition: 'width 0.3s ease'
  },

  noQuestionsContainer: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0',
    padding: '0'
  }
};

// Add responsive media query for mobile stacking
const mobileStyles = window.innerWidth <= 768 ? {
  splitLayout: {
    ...styles.splitLayout,
    flexDirection: 'column',
    gap: '1rem'
  },
  imageSection: {
    ...styles.imageSection,
    flex: 'none',
    maxHeight: '100px'
  },
  textSection: {
    ...styles.textSection,
    flex: 'none',
    padding: '0.5rem'
  }
} : {};

// Merge mobile styles if on mobile
Object.assign(styles, mobileStyles);

export default Flashcard;
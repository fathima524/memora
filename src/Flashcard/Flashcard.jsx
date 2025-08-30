import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import subjectsData from "../data/subjects.json";

function Flashcard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, difficulty, mode, questionLimit } = location.state || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [spacedRepetitionQueue, setSpacedRepetitionQueue] = useState([]);
  const [currentSessionQuestions, setCurrentSessionQuestions] = useState([]);

  // Spaced Repetition Algorithm Configuration
  const SPACED_REPETITION_CONFIG = {
    correct: {
      easy: 40,      // Reappear after 40 questions
      medium: 35,    // Reappear after 35 questions  
      hard: 30       // Reappear after 30 questions
      //heyy can u just give me the right count of the repititions of the cards for both correct and incorrect answers
      //like if they are correct and easy , then that question should appear after how many cards , if it is medium and correct 
      // then that question should appear after how many cards , similarly for hard and corrext , and repitition after easy medium and hard for wrong questions
    },
    incorrect: {
      easy: 8,       // Reappear after 8 questions
      medium: 10,    // Reappear after 10 questions
      hard: 12       // Reappear after 12 questions
    }
  };

  useEffect(() => {
    let selectedQuestions = [];

    if (mode === "free_trial") {
      // Free trial mode - random questions from all subjects
      const allQuestions = subjectsData.subjects.flatMap(s => s.questions);
      let filteredQuestions = allQuestions;
      
      if (difficulty && difficulty !== 'mixed') {
        filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
      }
      
      selectedQuestions = shuffleArray(filteredQuestions).slice(0, questionLimit || 5);
    } else if (mode === "challenge") {
      // Challenge mode - random questions from all subjects with mixed difficulty
      const allQuestions = subjectsData.subjects.flatMap(s => s.questions);
      selectedQuestions = shuffleArray(allQuestions).slice(0, 15);
    } else if (subject && subject !== "mixed") {
      // Specific subject
      const subjectData = subjectsData.subjects.find(s => s.id === subject);
      if (subjectData) {
        let filteredQuestions = subjectData.questions;
        if (difficulty && difficulty !== 'all') {
          filteredQuestions = subjectData.questions.filter(q => q.difficulty === difficulty);
        }
        selectedQuestions = shuffleArray(filteredQuestions);
      }
    } else {
      // Mixed questions from all subjects
      let allQuestions = subjectsData.subjects.flatMap(s => s.questions);
      if (difficulty && difficulty !== 'all') {
        allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
      }
      selectedQuestions = shuffleArray(allQuestions.slice(0, 10));
    }

    setQuestions(selectedQuestions);
    setCurrentSessionQuestions(selectedQuestions);
    setSessionStartTime(Date.now());
  }, [subject, difficulty, mode, questionLimit]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
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
    const questionDifficulty = question.difficulty;
    const reappearAfter = isCorrect 
      ? SPACED_REPETITION_CONFIG.correct[questionDifficulty]
      : SPACED_REPETITION_CONFIG.incorrect[questionDifficulty];

    const newEntry = {
      question: question,
      reappearAfter: reappearAfter,
      currentCount: 0,
      isCorrect: isCorrect,
      addedAt: Date.now()
    };

    setSpacedRepetitionQueue(prev => [...prev, newEntry]);
  };

  const getNextQuestion = () => {
    // Check if any spaced repetition questions are ready
    const readyQuestions = spacedRepetitionQueue.filter(item => 
      item.currentCount >= item.reappearAfter
    );

    if (readyQuestions.length > 0) {
      // Return a spaced repetition question
      const questionToReturn = readyQuestions[0];
      setSpacedRepetitionQueue(prev => 
        prev.filter(item => item !== questionToReturn)
      );
      return questionToReturn.question;
    }

    // Return next question from current session
    if (currentQuestionIndex < questions.length - 1) {
      return questions[currentQuestionIndex + 1];
    }

    return null;
  };

  const updateSpacedRepetitionCounts = () => {
    setSpacedRepetitionQueue(prev => 
      prev.map(item => ({
        ...item,
        currentCount: item.currentCount + 1
      }))
    );
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    if (mode === "free_trial") {
      handleFreeTrialEnd();
    } else {
      alert("Time's up! Let's see how you did.");
      handleFinishSession();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsTimerActive(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleMarkCorrect = () => {
    const newHistory = [...questionHistory, {
      question: currentQuestion,
      isCorrect: true,
      usedHint: showHint,
      timeSpent: 300 - timeLeft
    }];
    
    setQuestionHistory(newHistory);
    setScore(score + 1);
    setStreak(streak + 1);
    
    // Add to spaced repetition
    addToSpacedRepetition(currentQuestion, true);
    
    handleNextQuestion();
  };

  const handleMarkIncorrect = () => {
    const newHistory = [...questionHistory, {
      question: currentQuestion,
      isCorrect: false,
      usedHint: showHint,
      timeSpent: 300 - timeLeft
    }];
    
    setQuestionHistory(newHistory);
    setStreak(0);
    
    // Add to spaced repetition
    addToSpacedRepetition(currentQuestion, false);
    
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    updateSpacedRepetitionCounts();
    
    const nextQuestion = getNextQuestion();
    
    if (nextQuestion) {
      // Find the index of the next question in the current questions array
      const nextIndex = questions.findIndex(q => q.id === nextQuestion.id);
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        // If it's a spaced repetition question, add it to the current session
        setQuestions(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(questions.length);
      }
      
      setShowAnswer(false);
      setShowHint(false);
      setTimeLeft(300);
      setIsTimerActive(true);
    } else {
      if (mode === "free_trial") {
        handleFreeTrialEnd();
      } else {
        handleFinishSession();
      }
    }
  };

  const handleFreeTrialEnd = () => {
    const sessionData = {
      score: score,
      totalQuestions: questionHistory.length,
      timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
      mode: "free_trial",
      difficulty: difficulty,
      streak: streak
    };
    
    navigate("/pricing", { 
      state: { 
        fromFreeTrial: true, 
        sessionData: sessionData,
        message: "Great job! Upgrade to access unlimited questions and all subjects."
      } 
    });
  };

  const handleFinishSession = () => {
    const sessionData = {
      score: score,
      totalQuestions: questions.length,
      timeSpent: Math.floor((Date.now() - sessionStartTime) / 1000),
      subject: subject,
      difficulty: difficulty,
      streak: streak,
      spacedRepetitionData: spacedRepetitionQueue
    };
    
    // Save session data
    localStorage.setItem("lastSession", JSON.stringify(sessionData));
    localStorage.setItem("currentStreak", streak.toString());
    localStorage.setItem("spacedRepetitionQueue", JSON.stringify(spacedRepetitionQueue));
    
    navigate("/dashboard", { 
      state: { 
        completedSession: true, 
        sessionData: sessionData
      } 
    });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!questions.length) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)'
        }}>
          <h2 style={{ color: '#27374d', marginBottom: '1rem' }}>No questions available</h2>
          <p style={{ color: '#526d82', marginBottom: '2rem' }}>Please select a different subject or difficulty level.</p>
          <button 
            onClick={handleBackToDashboard}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const flashcardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    borderRadius: '24px',
    padding: window.innerWidth <= 768 ? '2rem' : '3rem',
    maxWidth: '900px',
    width: '100%',
    boxShadow: '0 25px 50px rgba(39, 55, 77, 0.3), 0 10px 20px rgba(39, 55, 77, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    marginBottom: '2rem',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  };

  const timerStyle = {
    background: timeLeft <= 60 ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px',
    fontSize: '1.1rem',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none'
  };

  const progressStyle = {
    color: '#526d82',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'rgba(157, 178, 191, 0.2)',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px'
  };

  const streakStyle = {
    color: '#27374d',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'rgba(39, 55, 77, 0.1)',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px'
  };

  const modeStyle = {
    color: mode === 'free_trial' ? '#e74c3c' : mode === 'challenge' ? '#f39c12' : '#27374d',
    fontSize: '0.9rem',
    fontWeight: '600',
    background: mode === 'free_trial' ? 'rgba(231, 76, 60, 0.1)' : mode === 'challenge' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(39, 55, 77, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const cardFrontStyle = {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '16px',
    padding: '2.5rem',
    marginBottom: '2rem',
    border: '2px solid #dde6ed',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const cardBackStyle = {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)',
    borderRadius: '16px',
    padding: '2.5rem',
    marginBottom: '2rem',
    border: '2px solid #c3e6cb',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const questionStyle = {
    fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.6rem',
    fontWeight: '600',
    color: '#27374d',
    lineHeight: '1.4',
    margin: 0
  };

  const answerStyle = {
    fontSize: window.innerWidth <= 768 ? '1.2rem' : '1.4rem',
    fontWeight: '600',
    color: '#155724',
    lineHeight: '1.4',
    marginBottom: '1rem'
  };

  const explanationStyle = {
    fontSize: '1rem',
    color: '#495057',
    lineHeight: '1.5',
    fontStyle: 'italic'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '1rem'
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '140px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(39, 55, 77, 0.3)'
  };

  const successButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'rgba(157, 178, 191, 0.3)',
    color: '#27374d',
    border: '2px solid #9db2bf'
  };

  const hintStyle = {
    background: 'rgba(255, 193, 7, 0.1)',
    border: '2px solid rgba(255, 193, 7, 0.3)',
    padding: '1.5rem',
    borderRadius: '12px',
    marginTop: '1rem',
    color: '#856404',
    fontSize: '1rem',
    fontWeight: '500',
    lineHeight: '1.4'
  };

  const difficultyBadgeStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: currentQuestion?.difficulty === 'easy' 
      ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
      : currentQuestion?.difficulty === 'medium'
      ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
      : 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={containerStyle}>
      <div style={flashcardStyle}>
        <div style={difficultyBadgeStyle}>
          {currentQuestion?.difficulty || 'Easy'}
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <div style={timerStyle}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div style={progressStyle}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div style={streakStyle}>
            🔥 Streak: {streak}
          </div>
          {mode && (
            <div style={modeStyle}>
              {mode === 'free_trial' ? 'Free Trial' : mode === 'challenge' ? 'Challenge' : 'Premium'}
            </div>
          )}
        </div>

        {/* Flashcard */}
        {!showAnswer ? (
          <div style={cardFrontStyle}>
            <h2 style={questionStyle}>
              {currentQuestion?.question}
            </h2>
          </div>
        ) : (
          <div style={cardBackStyle}>
            <h3 style={answerStyle}>
              Answer: {currentQuestion?.options[currentQuestion?.correct]}
            </h3>
            {currentQuestion?.explanation && (
              <p style={explanationStyle}>
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {/* Hint */}
        {showHint && currentQuestion?.hint && (
          <div style={hintStyle}>
            💡 <strong>Hint:</strong> {currentQuestion.hint}
          </div>
        )}

        {/* Buttons */}
        <div style={buttonContainerStyle}>
          {!showAnswer ? (
            <>
              {currentQuestion?.difficulty === 'hard' && currentQuestion?.hint && !showHint && (
                <button 
                  style={secondaryButtonStyle}
                  onClick={handleShowHint}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(157, 178, 191, 0.5)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(157, 178, 191, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  💡 Show Hint
                </button>
              )}
              <button 
                style={primaryButtonStyle}
                onClick={handleShowAnswer}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #1e2a3a 0%, #455a6b 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #27374d 0%, #526d82 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🔍 Show Answer
              </button>
            </>
          ) : (
            <>
              <button 
                style={successButtonStyle}
                onClick={handleMarkCorrect}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #218838 0%, #1e7e34 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ✅ I Got It Right
              </button>
              <button 
                style={dangerButtonStyle}
                onClick={handleMarkIncorrect}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #c82333 0%, #bd2130 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ❌ I Got It Wrong
              </button>
            </>
          )}
        </div>

        {/* Exit Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            style={{
              ...secondaryButtonStyle,
              fontSize: '0.9rem',
              padding: '0.8rem 1.5rem'
            }}
            onClick={handleBackToDashboard}
          >
            🏠 Back to Dashboard
          </button>
        </div>

        {/* Spaced Repetition Info */}
        {spacedRepetitionQueue.length > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(52, 152, 219, 0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#2980b9'
          }}>
            📚 {spacedRepetitionQueue.length} questions in review queue
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #27374d 0%, #526d82 50%, #9db2bf 100%)',
          width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Flashcard;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

const QuestionList = () => {
  const { id: subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subject and its flashcards
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select(`
          id,
          name,
          flashcards(id, question, correct, difficulty, explanation)
        `)
        .eq("id", subjectId)
        .single();

      if (error) throw error;

      setSubject(data);
    } catch (err) {
      console.error("Error fetching subject:", err.message);
      setError(err.message);
      setSubject(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete a flashcard
  const deleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", questionId);

    if (error) {
      console.error("Error deleting question:", error.message);
      alert("Error deleting question");
    } else {
      fetchQuestions(); // Refresh list
    }
  };

  // Difficulty color helper
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#48bb78";
      case "medium":
        return "#ed8936";
      case "hard":
        return "#f56565";
      default:
        return "#4299e1";
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [subjectId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.errorText}>{error || "Subject not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Questions for {subject.name}</h2>
          <Link
            to={`/admin/subjects/${subjectId}/questions/add`}
            style={styles.buttonPrimary}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            + Add New Question
          </Link>
        </div>

        {(!subject.flashcards || subject.flashcards.length === 0) ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No questions found for this subject.</p>
            <Link to={`/admin/subjects/${subjectId}/questions/add`} style={styles.buttonPrimary}>
              Add Your First Question
            </Link>
          </div>
        ) : (
          subject.flashcards.map((q, index) => (
            <div
              key={q.id}
              style={styles.questionCard}
              onMouseEnter={(e) => e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"}
              onMouseLeave={(e) => e.target.style.boxShadow = "none"}
            >
              <div style={styles.questionMeta}>
                Question #{index + 1} •{" "}
                <span
                  style={{
                    color: getDifficultyColor(q.difficulty),
                    fontWeight: "600",
                    marginLeft: "0.5rem",
                  }}
                >
                  {q.difficulty?.toUpperCase() || "MEDIUM"}
                </span>
              </div>
              <div style={styles.questionText}>{q.question}</div>
              <div style={styles.questionDetails}>
                <strong>Answer:</strong> {q.correct}
              </div>
              {q.explanation && (
                <div style={styles.questionDetails}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
              <div style={styles.actionButtons}>
                <Link
                  to={`/admin/subjects/${subjectId}/questions/edit/${q.id}`}
                  style={styles.buttonSecondary}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f7fafc";
                    e.target.style.borderColor = "#cbd5e0";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  style={styles.buttonDanger}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#feb2b2";
                    e.target.style.color = "#9b2c2c";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fed7d7";
                    e.target.style.color = "#c53030";
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <div style={styles.footer}>
          <Link
            to="/admin/subjects"
            style={styles.buttonSecondary}
            onMouseEnter={(e) => {
              e.target.style.background = "#f7fafc";
              e.target.style.borderColor = "#cbd5e0";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            ← Back to Subjects
          </Link>
        </div>
      </div>
    </div>
  );
};



// CSS Styles - Responsive with no white corners like ProfilePage
const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '0',
    margin: '0',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  card: {
    maxWidth: window.innerWidth <= 480 ? '100%' : window.innerWidth <= 768 ? '95%' : '1200px',
    width: '100%',
    margin: window.innerWidth <= 480 ? '0' : '2rem auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '0' : '8px',
    padding: window.innerWidth <= 480 ? '1rem' : window.innerWidth <= 768 ? '1.5rem' : '2.5rem',
    boxShadow: window.innerWidth <= 480 ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: window.innerWidth <= 480 ? 'none' : '1px solid rgba(203, 213, 224, 0.5)',
    minHeight: window.innerWidth <= 480 ? '100vh' : 'auto',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    paddingBottom: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    borderBottom: '2px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '1rem'
  },

  title: {
    fontSize: window.innerWidth <= 480 ? '1.25rem' : window.innerWidth <= 768 ? '1.5rem' : '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    letterSpacing: '-0.025em',
    margin: '0'
  },

  buttonPrimary: {
    padding: window.innerWidth <= 480 ? '0.6rem 1.2rem' : '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.925rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'inline-block',
    whiteSpace: 'nowrap'
  },

  questionCard: {
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: window.innerWidth <= 480 ? '1rem' : '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },

  questionText: {
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1rem',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },

  questionMeta: {
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    color: '#718096',
    marginBottom: '0.75rem'
  },

  questionDetails: {
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    color: '#4a5568',
    marginBottom: '1rem',
    lineHeight: '1.4',
    wordBreak: 'break-word'
  },

  correctAnswer: {
    color: '#48bb78',
    fontWeight: '600',
    marginLeft: '0.5rem',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem'
  },

  actionButtons: {
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.4rem' : '0.5rem',
    flexWrap: 'wrap'
  },

  buttonSecondary: {
    padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },

  buttonDanger: {
    padding: window.innerWidth <= 480 ? '0.4rem 0.8rem' : '0.5rem 1rem',
    background: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
    borderRadius: '4px',
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },

  loadingContainer: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: '0',
    padding: '0'
  },

  loadingCard: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)',
    margin: '1rem',
    maxWidth: '400px',
    width: window.innerWidth <= 480 ? '90%' : '100%'
  },

  loadingText: {
    textAlign: 'center',
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    color: '#4a5568',
    fontWeight: '600'
  },

  errorText: {
    textAlign: 'center',
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    color: '#e53e3e',
    fontWeight: '600'
  },

  emptyState: {
    textAlign: 'center',
    padding: window.innerWidth <= 480 ? '2rem 1rem' : '3rem',
    color: '#4a5568'
  },

  emptyText: {
    fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
    marginBottom: '1rem',
    fontWeight: '500'
  },

  footer: {
    paddingTop: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    borderTop: '1px solid #e2e8f0',
    marginTop: window.innerWidth <= 480 ? '1.5rem' : '2rem'
  },

  // Hover effects for interactive elements
  buttonPrimaryHover: {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(45, 55, 72, 0.3)'
    }
  },

  buttonSecondaryHover: {
    ':hover': {
      background: '#f7fafc',
      borderColor: '#cbd5e0'
    }
  },

  buttonDangerHover: {
    ':hover': {
      background: '#feb2b2',
      borderColor: '#fc8181'
    }
  },

  questionCardHover: {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  }
};

export default QuestionList;
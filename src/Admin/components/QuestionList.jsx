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




// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif"
  },

  card: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: '2.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0'
  },

  title: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    letterSpacing: '-0.025em'
  },

  buttonPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.925rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'inline-block'
  },

  questionCard: {
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.15s ease'
  },

  questionText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },

  questionMeta: {
    fontSize: '0.8rem',
    color: '#718096',
    marginBottom: '0.75rem'
  },

  questionDetails: {
    fontSize: '0.9rem',
    color: '#4a5568',
    marginBottom: '1rem',
    lineHeight: '1.4'
  },

  correctAnswer: {
    color: '#48bb78',
    fontWeight: '600',
    marginLeft: '0.5rem'
  },

  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },

  buttonSecondary: {
    padding: '0.5rem 1rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease'
  },

  buttonDanger: {
    padding: '0.5rem 1rem',
    background: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },

  loadingText: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#4a5568'
  },

  errorText: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#e53e3e'
  },

  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#4a5568'
  },

  emptyText: {
    fontSize: '1.1rem',
    marginBottom: '1rem'
  },

  footer: {
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
    marginTop: '2rem'
  }
};

export default QuestionList;
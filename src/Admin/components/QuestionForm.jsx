import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

const QuestionForm = () => {
  const { id: subjectId, qid } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [correct, setCorrect] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [explanation, setExplanation] = useState("");

  // Fetch flashcard if editing
  useEffect(() => {
    const fetchQuestion = async () => {
      if (qid) {
        const { data, error } = await supabase
          .from("flashcards")
          .select("*")
          .eq("id", qid)
          .single();

        if (error) {
          console.error(error);
          alert("Error fetching flashcard");
        } else if (data) {
          setQuestion(data.question);
          setCorrect(data.correct);
          setDifficulty(data.difficulty || "medium");
          setExplanation(data.explanation || "");
        }
      }
    };

    fetchQuestion();
  }, [qid]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch subject name
      const { data: subjectData, error: subError } = await supabase
        .from("subjects")
        .select("name")
        .eq("id", subjectId)
        .single();

      if (subError) throw subError;

      const payload = {
        question,
        correct,
        difficulty,
        explanation,
        subject_id: subjectId,
        subject_name: subjectData.name || null,
      };

      if (qid) {
        const { error } = await supabase
          .from("flashcards")
          .update(payload)
          .eq("id", qid);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("flashcards")
          .insert([payload]);
        if (error) throw error;
      }

      navigate(`/admin/subjects/${subjectId}/questions`);
    } catch (err) {
      console.error(err);
      alert("Error saving flashcard");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{qid ? "Edit Flashcard" : "Add New Flashcard"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Question Text</label>
            <input
              style={styles.input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Enter the flashcard question..."
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={styles.flexGroup}>
            <div style={styles.flexItem}>
              <label style={styles.label}>Correct Answer</label>
              <input
                style={styles.input}
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                placeholder="Correct answer..."
                onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <div style={styles.flexItem}>
              <label style={styles.label}>Difficulty Level</label>
              <select
                style={styles.select}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Explanation (Optional)</label>
            <textarea
              style={styles.textarea}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide an explanation for the answer..."
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.buttonPrimary}
            >
              {qid ? "Update Flashcard" : "Add Flashcard"}
            </button>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={() => navigate(`/admin/subjects/${subjectId}/questions`)}
            >
              Cancel
            </button>
          </div>
        </form>
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
    overflowX: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    maxWidth: window.innerWidth <= 480 ? '100%' : window.innerWidth <= 768 ? '95%' : '900px',
    width: '100%',
    margin: window.innerWidth <= 480 ? '0' : '2rem auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '0' : '8px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    boxShadow: window.innerWidth <= 480 ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: window.innerWidth <= 480 ? 'none' : '1px solid rgba(203, 213, 224, 0.5)',
    minHeight: window.innerWidth <= 480 ? '100vh' : 'auto',
    boxSizing: 'border-box',
    overflowY: 'auto'
  },

  title: {
    fontSize: window.innerWidth <= 480 ? '1.25rem' : window.innerWidth <= 768 ? '1.5rem' : '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem',
    margin: '0 0 1.5rem 0'
  },

  formGroup: {
    marginBottom: window.innerWidth <= 480 ? '1.2rem' : '1.5rem'
  },

  label: {
    display: 'block',
    fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  input: {
    width: '100%',
    padding: window.innerWidth <= 480 ? '0.7rem 0.9rem' : '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    color: '#2d3748',
    background: 'white',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none'
  },

  textarea: {
    width: '100%',
    padding: window.innerWidth <= 480 ? '0.7rem 0.9rem' : '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    color: '#2d3748',
    background: 'white',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    minHeight: window.innerWidth <= 480 ? '80px' : '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none'
  },

  select: {
    width: '100%',
    padding: window.innerWidth <= 480 ? '0.7rem 0.9rem' : '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    color: '#2d3748',
    background: 'white',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    cursor: 'pointer',
    boxSizing: 'border-box',
    outline: 'none'
  },

  flexGroup: {
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    marginBottom: window.innerWidth <= 480 ? '1.2rem' : '1.5rem',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
  },

  flexItem: {
    flex: 1,
    minWidth: window.innerWidth <= 480 ? '100%' : '0'
  },

  buttonContainer: {
    paddingTop: window.innerWidth <= 480 ? '1rem' : '1rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
    justifyContent: window.innerWidth <= 480 ? 'stretch' : 'flex-start'
  },

  buttonPrimary: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.5rem' : '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 4px rgba(45, 55, 72, 0.2)',
    outline: 'none'
  },

  buttonSecondary: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.5rem' : '0.75rem 1.5rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  }
};

export default QuestionForm;
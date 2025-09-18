import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

const SubjectForm = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { subjectId } = useParams();

  // Fetch subject if editing
  useEffect(() => {
    const fetchSubject = async () => {
      if (subjectId) {
        const { data, error } = await supabase
          .from("subjects")
          .select("id, name")
          .eq("id", subjectId)
          .single();

        if (error) {
          console.error("Error fetching subject:", error.message);
          alert("Subject not found");
          navigate("/admin/subjects");
        } else {
          setName(data.name);
        }
      }
    };

    fetchSubject();
  }, [subjectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (subjectId) {
        // Edit existing subject
        const { error } = await supabase
          .from("subjects")
          .update({ name })
          .eq("id", subjectId);

        if (error) throw error;
      } else {
        // Add new subject (UUID auto-generated)
        const { error } = await supabase.from("subjects").insert([{ name }]);
        if (error) throw error;
      }

      navigate("/admin/subjects");
    } catch (err) {
      console.error(err);
      alert("Error saving subject");
    }
  };

  const handleDelete = async () => {
    if (!subjectId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this subject? This will also delete all associated flashcards."
      )
    ) {
      try {
        // Delete associated flashcards first
        const { error: flashError } = await supabase
          .from("flashcards")
          .delete()
          .eq("subject_id", subjectId);
        if (flashError) console.error("Error deleting flashcards:", flashError.message);

        // Delete subject
        const { error } = await supabase.from("subjects").delete().eq("id", subjectId);
        if (error) throw error;

        navigate("/admin/subjects");
      } catch (err) {
        console.error(err);
        alert("Error deleting subject");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{subjectId ? "Edit Subject" : "Add New Subject"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Subject Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter subject name (e.g., Human Anatomy)"
              onFocus={(e) => (e.target.style.borderColor = "#4299e1")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.buttonPrimary}>
              {subjectId ? "Update Subject" : "Add Subject"}
            </button>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={() => navigate("/admin/subjects")}
            >
              Cancel
            </button>
            {subjectId && (
              <button 
  type="button"
  style={{ ...styles.buttonDanger, marginLeft: "1rem" }}
  onClick={handleDelete}
  onMouseEnter={(e) => {
    e.target.style.background = '#feb2b2';
    e.target.style.color = '#9b2c2c';
  }}
  onMouseLeave={(e) => {
    e.target.style.background = '#fed7d7';
    e.target.style.color = '#c53030';
  }}
>
  Delete Subject
</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



// CSS Styles - No Corner Padding, Fully Responsive
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
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    maxWidth: window.innerWidth <= 480 ? '95%' : window.innerWidth <= 768 ? '85%' : '600px',
    width: window.innerWidth <= 480 ? '95%' : window.innerWidth <= 768 ? '85%' : '100%',
    margin: window.innerWidth <= 480 ? '1rem' : window.innerWidth <= 768 ? '1.5rem' : '2rem auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: window.innerWidth <= 480 ? '12px' : window.innerWidth <= 768 ? '14px' : '16px',
    padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)',
    boxSizing: 'border-box',
    maxHeight: window.innerWidth <= 480 ? '90vh' : '95vh',
    overflowY: 'auto'
  },

  title: {
    fontSize: window.innerWidth <= 480 ? '1.4rem' : window.innerWidth <= 768 ? '1.6rem' : '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: window.innerWidth <= 480 ? '1.5rem' : '2rem',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem',
    textAlign: window.innerWidth <= 480 ? 'center' : 'left'
  },

  buttonDanger: {
    padding: window.innerWidth <= 480 ? '0.7rem 1.2rem' : '0.75rem 1.5rem',
    background: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    width: window.innerWidth <= 480 ? '100%' : 'auto',
    marginTop: window.innerWidth <= 480 ? '0.5rem' : '0'
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
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: window.innerWidth <= 480 ? '80px' : '100px',
    resize: 'vertical'
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
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer'
  },

  buttonContainer: {
    paddingTop: window.innerWidth <= 480 ? '1rem' : '1rem',
    borderTop: '1px solid #e2e8f0',
    marginTop: window.innerWidth <= 480 ? '1rem' : '1.5rem',
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
    justifyContent: window.innerWidth <= 480 ? 'stretch' : 'flex-start'
  },

  buttonPrimary: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.2rem' : '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.9rem' : '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    flex: window.innerWidth <= 480 ? '1' : 'none',
    minWidth: window.innerWidth <= 480 ? 'auto' : '120px',
    textAlign: 'center'
  },

  buttonSecondary: {
    padding: window.innerWidth <= 480 ? '0.8rem 1.2rem' : '0.75rem 1.5rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: window.innerWidth <= 480 ? '0.9rem' : '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    flex: window.innerWidth <= 480 ? '1' : 'none',
    minWidth: window.innerWidth <= 480 ? 'auto' : '120px',
    textAlign: 'center'
  },

  // Form validation styles
  inputError: {
    borderColor: '#e53e3e',
    boxShadow: '0 0 0 1px #e53e3e'
  },

  inputFocus: {
    borderColor: '#4299e1',
    boxShadow: '0 0 0 1px #4299e1'
  },

  errorMessage: {
    color: '#e53e3e',
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    marginTop: '0.25rem',
    fontWeight: '500'
  },

  // Loading states
  loadingOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: window.innerWidth <= 480 ? '12px' : '16px',
    backdropFilter: 'blur(2px)'
  },

  loadingText: {
    color: '#4a5568',
    fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem',
    fontWeight: '500'
  },

  // Success message
  successMessage: {
    background: '#c6f6d5',
    color: '#22543d',
    padding: window.innerWidth <= 480 ? '0.8rem' : '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
    border: '1px solid #9ae6b4'
  },

  // Help text
  helpText: {
    fontSize: window.innerWidth <= 480 ? '0.75rem' : '0.8rem',
    color: '#718096',
    marginTop: '0.25rem',
    lineHeight: '1.4'
  },

  // Required field indicator
  required: {
    color: '#e53e3e',
    marginLeft: '0.25rem'
  },

  // Hover effects
  buttonPrimaryHover: {
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  },

  buttonSecondaryHover: {
    background: '#f7fafc',
    borderColor: '#cbd5e0',
    transform: 'translateY(-1px)'
  },

  buttonDangerHover: {
    background: '#feb2b2',
    color: '#9b2c2c',
    transform: 'translateY(-1px)'
  },

  inputHover: {
    borderColor: '#cbd5e0'
  },

  // Disabled states
  buttonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
    transform: 'none'
  },

  inputDisabled: {
    backgroundColor: '#f7fafc',
    color: '#a0aec0',
    cursor: 'not-allowed'
  },

  // Mobile-specific adjustments
  mobileTitle: {
    textAlign: 'center',
    fontSize: '1.4rem'
  },

  mobileButtonGroup: {
    flexDirection: 'column',
    gap: '0.8rem'
  },

  // Responsive form layout
  formRow: {
    display: 'flex',
    gap: window.innerWidth <= 480 ? '0' : '1rem',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
  },

  formColumn: {
    flex: '1',
    minWidth: '0'
  }
};

export default SubjectForm;
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




// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif"
  },

  card: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: '2.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)'
  },

  title: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '2rem',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem'
  },
  buttonDanger: {
  padding: '0.75rem 1.5rem',
  background: '#fed7d7',
  color: '#c53030',
  border: '1px solid #feb2b2',
  borderRadius: '6px',
  fontSize: '0.925rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
},

  formGroup: {
    marginBottom: '1.5rem'
  },

  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.925rem',
    color: '#2d3748',
    background: 'white',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit'
  },

  buttonContainer: {
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0'
  },

  buttonPrimary: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginRight: '1rem'
  },

  buttonSecondary: {
    padding: '0.75rem 1.5rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  }
};

export default SubjectForm;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("subjects")
        .select(`
          id,
          name,
          created_at,
          flashcards(id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Include count of flashcards
      const subjectsWithCount = data.map((sub) => ({
        ...sub,
        flashcardCount: sub.flashcards ? sub.flashcards.length : 0,
      }));

      setSubjects(subjectsWithCount);
    } catch (err) {
      console.error("Error fetching subjects:", err.message);
      setError(err.message);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this subject? This will also delete all associated questions."
      )
    ) {
      // Delete the subject
      const { error } = await supabase.from("subjects").delete().eq("id", id);

      if (error) {
        console.error("Error deleting subject:", error.message);
        alert("Error deleting subject");
      } else {
        // Optional: delete related flashcards
        const { error: flashError } = await supabase
          .from("flashcards")
          .delete()
          .eq("subject_id", id);
        if (flashError) console.error("Error deleting flashcards:", flashError.message);

        fetchSubjects(); // Refresh list
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Subject Management</h2>
          <Link
            to="/admin/subjects/add"
            style={styles.buttonPrimary}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            + Add New Subject
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No subjects found.</p>
            <Link to="/admin/subjects/add" style={styles.buttonPrimary}>
              Add Your First Subject
            </Link>
          </div>
        ) : (
          <>
            {subjects.map((sub) => (
              <div
                key={sub.id}
                style={styles.subjectCard}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)")
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                <div style={styles.subjectName}>{sub.name}</div>
                <div style={styles.subjectMeta}>
                  <span style={styles.stats}>Subject ID: {sub.id}</span>
                  <span style={styles.stats}> | Flashcards: {sub.flashcardCount}</span>
                </div>
                <div style={styles.actionButtons}>
                  <Link
                    to={`/admin/subjects/${sub.id}/questions`}
                    style={styles.buttonManageQuestions}
                    onMouseEnter={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)";
                    }}
                  >
                    📝 Manage Questions
                  </Link>
                  <Link
                    to={`/admin/subjects/edit/${sub.id}`}
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
                    onClick={() => deleteSubject(sub.id)}
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
            ))}
          </>
        )}

        <div style={styles.footer}>
          <Link
            to="/admin"
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
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)",
    padding: "2rem",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
  },

  card: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    borderRadius: "8px",
    padding: "2.5rem",
    boxShadow:
      "0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(203, 213, 224, 0.5)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e2e8f0",
  },

  title: {
    fontSize: "1.875rem",
    fontWeight: "600",
    color: "#1a202c",
    letterSpacing: "-0.025em",
  },

  buttonPrimary: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.925rem",
    fontWeight: "500",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    display: "inline-block",
  },

  subjectCard: {
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "1.5rem",
    marginBottom: "1rem",
    transition: "all 0.15s ease",
  },

  subjectName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: "0.5rem",
  },

  subjectMeta: {
    fontSize: "0.875rem",
    color: "#4a5568",
    marginBottom: "1rem",
  },

  actionButtons: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },

  buttonSecondary: {
    padding: "0.5rem 1rem",
    background: "white",
    color: "#2d3748",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s ease",
  },

  buttonManageQuestions: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s ease",
  },

  buttonDanger: {
    padding: "0.5rem 1rem",
    background: "#fed7d7",
    color: "#c53030",
    border: "1px solid #feb2b2",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  stats: {
    fontSize: "0.8rem",
    color: "#718096",
    fontWeight: "500",
  },

  loadingText: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#4a5568",
  },

  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "#4a5568",
  },

  emptyText: {
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },

  footer: {
    paddingTop: "2rem",
    borderTop: "1px solid #e2e8f0",
    marginTop: "2rem",
  },
};

export default SubjectList;

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
// CSS Styles - No Corner Padding, Fully Responsive
const styles = {
  container: {
    minHeight: "100vh",
    minWidth: "100vw",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)",
    padding: "0",
    margin: "0",
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    overflowY: "auto",
    overflowX: "hidden",
    boxSizing: "border-box"
  },

  card: {
    maxWidth: window.innerWidth <= 480 ? "95%" : window.innerWidth <= 768 ? "90%" : "1000px",
    margin: window.innerWidth <= 480 ? "1rem auto" : window.innerWidth <= 768 ? "1.5rem auto" : "2rem auto",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    borderRadius: window.innerWidth <= 480 ? "12px" : "16px",
    padding: window.innerWidth <= 480 ? "1.5rem" : window.innerWidth <= 768 ? "2rem" : "2.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(203, 213, 224, 0.5)",
    minHeight: "calc(100vh - 4rem)",
    boxSizing: "border-box"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: window.innerWidth <= 768 ? "flex-start" : "center",
    marginBottom: window.innerWidth <= 480 ? "1.5rem" : "2rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e2e8f0",
    flexDirection: window.innerWidth <= 768 ? "column" : "row",
    gap: window.innerWidth <= 768 ? "1rem" : "0"
  },

  title: {
    fontSize: window.innerWidth <= 480 ? "1.5rem" : window.innerWidth <= 768 ? "1.7rem" : "1.875rem",
    fontWeight: "600",
    color: "#1a202c",
    letterSpacing: "-0.025em",
    marginBottom: window.innerWidth <= 768 ? "0.5rem" : "0"
  },

  buttonPrimary: {
    padding: window.innerWidth <= 480 ? "0.7rem 1.2rem" : "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: window.innerWidth <= 480 ? "0.85rem" : "0.925rem",
    fontWeight: "500",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    display: "inline-block",
    whiteSpace: "nowrap",
    minWidth: window.innerWidth <= 480 ? "140px" : "auto",
    textAlign: "center"
  },

  subjectCard: {
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: window.innerWidth <= 480 ? "8px" : "6px",
    padding: window.innerWidth <= 480 ? "1.2rem" : window.innerWidth <= 768 ? "1.3rem" : "1.5rem",
    marginBottom: window.innerWidth <= 480 ? "1rem" : "1rem",
    transition: "all 0.15s ease",
    boxSizing: "border-box"
  },

  subjectName: {
    fontSize: window.innerWidth <= 480 ? "1.1rem" : window.innerWidth <= 768 ? "1.15rem" : "1.25rem",
    fontWeight: "600",
    color: "#1a202c",
    marginBottom: "0.5rem",
    lineHeight: "1.3",
    wordBreak: "break-word"
  },

  subjectMeta: {
    fontSize: window.innerWidth <= 480 ? "0.8rem" : "0.875rem",
    color: "#4a5568",
    marginBottom: window.innerWidth <= 480 ? "1rem" : "1rem",
    lineHeight: "1.4"
  },

  actionButtons: {
    display: "flex",
    gap: window.innerWidth <= 480 ? "0.4rem" : "0.5rem",
    alignItems: "center",
    flexWrap: window.innerWidth <= 480 ? "wrap" : "nowrap",
    justifyContent: window.innerWidth <= 480 ? "flex-start" : "flex-start"
  },

  buttonSecondary: {
    padding: window.innerWidth <= 480 ? "0.5rem 0.8rem" : "0.5rem 1rem",
    background: "white",
    color: "#2d3748",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: window.innerWidth <= 480 ? "0.75rem" : "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    flexShrink: 0
  },

  buttonManageQuestions: {
    padding: window.innerWidth <= 480 ? "0.5rem 0.8rem" : "0.5rem 1rem",
    background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: window.innerWidth <= 480 ? "0.75rem" : "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    flexShrink: 0
  },

  buttonDanger: {
    padding: window.innerWidth <= 480 ? "0.5rem 0.8rem" : "0.5rem 1rem",
    background: "#fed7d7",
    color: "#c53030",
    border: "1px solid #feb2b2",
    borderRadius: "4px",
    fontSize: window.innerWidth <= 480 ? "0.75rem" : "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    flexShrink: 0
  },

  stats: {
    fontSize: window.innerWidth <= 480 ? "0.75rem" : "0.8rem",
    color: "#718096",
    fontWeight: "500",
    marginTop: window.innerWidth <= 480 ? "0.5rem" : "0"
  },

  loadingText: {
    textAlign: "center",
    fontSize: window.innerWidth <= 480 ? "1rem" : "1.1rem",
    color: "#4a5568",
    padding: window.innerWidth <= 480 ? "2rem" : "3rem"
  },

  emptyState: {
    textAlign: "center",
    padding: window.innerWidth <= 480 ? "2rem 1rem" : window.innerWidth <= 768 ? "2.5rem" : "3rem",
    color: "#4a5568"
  },

  emptyText: {
    fontSize: window.innerWidth <= 480 ? "1rem" : "1.1rem",
    marginBottom: "1rem",
    lineHeight: "1.5"
  },

  footer: {
    paddingTop: window.innerWidth <= 480 ? "1.5rem" : "2rem",
    borderTop: "1px solid #e2e8f0",
    marginTop: window.innerWidth <= 480 ? "1.5rem" : "2rem"
  },

  // Additional responsive utilities
  mobileStack: {
    flexDirection: window.innerWidth <= 480 ? "column" : "row",
    alignItems: window.innerWidth <= 480 ? "stretch" : "center",
    gap: window.innerWidth <= 480 ? "0.5rem" : "0.5rem"
  },

  // Hover effects for better interaction
  cardHover: {
    background: "#edf2f7",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
  },

  buttonPrimaryHover: {
    background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
  },

  buttonSecondaryHover: {
    background: "#f7fafc",
    borderColor: "#cbd5e0",
    transform: "translateY(-1px)"
  },

  buttonManageQuestionsHover: {
    background: "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
    transform: "translateY(-1px)"
  },

  buttonDangerHover: {
    background: "#feb2b2",
    color: "#9b2c2c"
  },

  // Mobile-specific adjustments
  mobileHeader: {
    width: "100%",
    textAlign: "left"
  },

  mobileButtonGroup: {
    width: "100%",
    justifyContent: "center"
  },

  // Tablet-specific adjustments
  tabletCard: {
    padding: "2rem",
    margin: "1.5rem"
  },

  // Loading and error states
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
    flexDirection: "column",
    gap: "1rem"
  },

  errorState: {
    textAlign: "center",
    padding: window.innerWidth <= 480 ? "2rem 1rem" : "3rem",
    color: "#e53e3e",
    backgroundColor: "#fed7d7",
    borderRadius: "8px",
    border: "1px solid #feb2b2",
    margin: "1rem 0"
  }
};

export default SubjectList;
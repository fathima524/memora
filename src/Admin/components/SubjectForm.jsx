import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../supabase/supabaseClient";
import {
  Save,
  ArrowLeft,
  Loader,
  BookOpen,
  Trash2,
  AlertCircle
} from 'lucide-react';

const SubjectForm = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { subjectId } = useParams();

  // Fetch subject if editing
  useEffect(() => {
    const fetchSubject = async () => {
      if (subjectId) {
        setFetching(true);
        const { data, error } = await supabase
          .from("subjects")
          .select("id, name")
          .eq("id", subjectId)
          .single();

        if (error) {
          console.error("Error fetching subject:", error.message);
          toast.error("Subject not found");
          navigate("/admin/subjects");
        } else {
          setName(data.name);
        }
        setFetching(false);
      } else {
        setFetching(false);
      }
    };

    fetchSubject();
  }, [subjectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subjectId) {
        // Edit existing subject
        const { error } = await supabase
          .from("subjects")
          .update({ name })
          .eq("id", subjectId);

        if (error) throw error;
      } else {
        // Add new subject
        const { error } = await supabase.from("subjects").insert([{ name }]);
        if (error) throw error;
      }

      navigate("/admin/subjects");
    } catch (err) {
      console.error(err);
      toast.error("Error saving subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!subjectId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this subject? This will also delete all associated flashcards."
      )
    ) {
      setLoading(true);
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
        toast.error("Error deleting subject");
        setLoading(false);
      }
    }
  };

  if (fetching) {
    return (
      <div className="form-page">
        <div className="auth-mesh"></div>
        <div className="full-screen-loader">
          <div className="loader-content">
            <Loader size={48} className="spinner" />
            <h2 className="brand-name">Memora</h2>
          </div>
        </div>
        <style>{`
        .full-screen-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          color: #38bdf8;
          animation: spin 1s linear infinite;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .loader-content p {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="auth-mesh"></div>

      <main className="form-main">
        <div className="form-container">
          <div className="form-header">

            <h1>{subjectId ? "Edit Subject" : "Add New Subject"}</h1>
            <p>{subjectId ? "Update subject details below" : "Create a new subject for the MBBS curriculum"}</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-form">
            <div className="form-section">
              <div className="section-title">
                <BookOpen size={20} className="text-blue" />
                <h3>Subject Details</h3>
              </div>

              <div className="input-group">
                <label>Subject Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., Human Anatomy"
                    autoFocus
                  />
                </div>
                <p className="help-text">This will be visible on the dashboard and question bank.</p>
              </div>
            </div>

            <div className="form-actions">
              <div className="left-actions">
                {subjectId && (
                  <button type="button" onClick={handleDelete} className="btn-danger" disabled={loading}>
                    <Trash2 size={16} />
                    Delete Subject
                  </button>
                )}
              </div>
              <div className="right-actions">
                <button type="button" onClick={() => navigate("/admin/subjects")} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? (
                    <>
                      <Loader size={16} className="spinner-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {subjectId ? "Update Subject" : "Create Subject"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="page-footer">
          <Link to="/admin/subjects" className="btn-back">
            <ArrowLeft size={16} />
            Back to Subjects
          </Link>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .form-page {
          min-height: 100vh;
          background: #060912;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .auth-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 10% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.02) 0%, transparent 60%);
          z-index: 0;
          pointer-events: none;
        }

        .form-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 3rem 1.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #f8fafc;
        }

        .form-header p {
          color: #94a3b8;
          font-size: 1rem;
        }

        .glass-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .form-section {
          margin-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-title h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: #1e293b;
        }

        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .input-wrapper input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          color: #0f172a;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .input-wrapper input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
          outline: none;
        }

        .help-text {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .right-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-cancel {
          padding: 0.875rem 1.5rem;
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #64748b;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-submit {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-danger {
          padding: 0.875rem 1.5rem;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #ef4444;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-danger:hover {
          background: #fee2e2;
          border-color: #fecaca;
        }

        .spinner-sm {
          animation: spin 1s linear infinite;
        }
        
        .text-blue { color: #38bdf8; }

        @media (max-width: 640px) {
          .glass-form {
            padding: 1.5rem;
          }
          .form-actions {
            flex-direction: column-reverse; /* Stack buttons */
            gap: 1.5rem;
            align-items: stretch; /* Full width */
          }
          .right-actions {
            flex-direction: column-reverse;
            width: 100%;
          }
          .left-actions {
            width: 100%;
          }
          .btn-cancel, .btn-submit, .btn-danger {
            width: 100%;
            justify-content: center;
          }
        }

        /* Footer */
        .page-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: center; /* Center the back button */
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
};

export default SubjectForm;
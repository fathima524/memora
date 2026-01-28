import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../supabase/supabaseClient";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  FileText,
  Loader,
  Search
} from 'lucide-react';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      const { error } = await supabase.from("subjects").delete().eq("id", id);

      if (error) {
        console.error("Error deleting subject:", error.message);
        toast.error("Error deleting subject");
      } else {
        const { error: flashError } = await supabase
          .from("flashcards")
          .delete()
          .eq("subject_id", id);
        if (flashError) console.error("Error deleting flashcards:", flashError.message);

        fetchSubjects();
      }
    }
  };
  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="subject-list-page">
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
            background: #060912;
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
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="subject-list-page">
      <div className="auth-mesh"></div>

      <main className="subject-main">
        {/* Header Section */}
        <section className="page-header">
          <div className="header-content">
            <div className="header-left">
              <div className="icon-badge">
                <BookOpen size={24} />
              </div>
              <div>
                <h1>Subject Management</h1>
                <p className="header-subtitle">Manage all MBBS subjects and categories</p>
              </div>
            </div>
            <Link to="/admin/subjects/add" className="btn-primary">
              <Plus size={18} />
              Add New Subject
            </Link>
          </div>
        </section>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="subjects-container">
          {filteredSubjects.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? (
                <>
                  <Search size={64} className="empty-icon" />
                  <h3>No subjects found matching "{searchQuery}"</h3>
                  <p>Try a different search term</p>
                </>
              ) : (
                <>
                  <BookOpen size={64} className="empty-icon" />
                  <h3>No subjects found</h3>
                  <p>Get started by adding your first subject</p>
                  <Link to="/admin/subjects/add" className="btn-primary">
                    <Plus size={18} />
                    Add Your First Subject
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="subjects-grid">
              {filteredSubjects.map((sub) => (
                <div key={sub.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-icon">
                      <BookOpen size={24} />
                    </div>
                    <div className="subject-info">
                      <h3>{sub.name}</h3>
                      <div className="subject-meta">
                        <span className="meta-item">
                          <FileText size={14} />
                          {sub.flashcardCount} flashcards
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <Link
                      to={`/admin/subjects/${sub.id}/questions`}
                      className="btn-manage"
                    >
                      <FileText size={16} />
                      Manage Questions
                    </Link>
                    <div className="action-group">
                      <Link
                        to={`/admin/subjects/edit/${sub.id}`}
                        className="btn-icon"
                        title="Edit Subject"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => deleteSubject(sub.id)}
                        className="btn-icon danger"
                        title="Delete Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="page-footer">
          <Link to="/admin" className="btn-back">
            <ArrowLeft size={18} />
            Back to Admin Dashboard
          </Link>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .subject-list-page {
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

        .subject-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 2.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        /* Header Section */
        .page-header {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(56, 189, 248, 0.15) 100%);
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(32px);
          padding: 2.5rem 3rem;
          margin-bottom: 3rem;
          box-shadow: 
            0 50px 140px -30px rgba(0, 0, 0, 0.6),
            inset 0 1px 4px rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-badge {
          width: 64px;
          height: 64px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -2px;
          margin: 0 0 0.5rem 0;
          line-height: 1;
          color: white;
        }

        .header-subtitle {
          color: #94a3b8;
          font-size: 1rem;
          margin: 0;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 2rem;
          display: flex;
          justify-content: flex-start;
        }

        .search-bar {
          position: relative;
          width: 100%;
          max-width: 600px;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-bar input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .search-bar input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
        }

        .search-bar input::placeholder {
          color: #64748b;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.75rem;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .btn-primary:hover {
          background: rgba(56, 189, 248, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
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

        /* Subjects Container */
        .subjects-container {
          min-height: 400px;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
        }

        /* Subject Card */
        .subject-card {
          background: linear-gradient(145deg, rgba(245, 235, 215, 0.18) 0%, rgba(245, 235, 215, 0.08) 100%);
          border: 1px solid rgba(245, 235, 215, 0.25);
          border-radius: 24px;
          padding: 2rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .subject-card:hover {
          background: linear-gradient(145deg, rgba(245, 235, 215, 0.22) 0%, rgba(245, 235, 215, 0.12) 100%);
          transform: translateY(-5px);
          border-color: rgba(245, 235, 215, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-header {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .subject-icon {
          width: 56px;
          height: 56px;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .subject-info {
          flex: 1;
          min-width: 0;
        }

        .subject-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .subject-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Card Actions */
        .card-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-manage {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #818cf8;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-manage:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }

        .action-group {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateY(-2px);
        }

        .btn-icon.danger {
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.2);
        }

        .btn-icon.danger:hover {
          background: rgba(248, 113, 113, 0.1);
          border-color: rgba(248, 113, 113, 0.3);
          color: #ef4444;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          min-height: 400px;
        }

        .empty-icon {
          color: #38bdf8;
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0 0 2rem 0;
        }

        /* Loading */
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loader-content p {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0;
        }

        /* Footer */
        .page-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .subjects-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .subject-main {
            padding: 1.5rem;
          }

          .page-header {
            padding: 2rem 1.5rem;
            border-radius: 24px;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .subjects-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .card-actions {
            flex-direction: column;
          }

          .btn-manage {
            width: 100%;
          }

          .action-group {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default SubjectList;
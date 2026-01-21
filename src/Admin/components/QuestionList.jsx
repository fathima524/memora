import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  Loader,
  Search
} from 'lucide-react';

const QuestionList = () => {
  const { id: subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          flashcards(id, question, correct, difficulty, explanation, image_url, answer_image_url)
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
        return "#4ade80";
      case "medium":
        return "#fbbf24";
      case "hard":
        return "#f87171";
      default:
        return "#38bdf8";
    }
  };

  // Filter and Group Logic
  const filteredQuestions = subject?.flashcards?.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.correct.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const groupedQuestions = {
    easy: filteredQuestions.filter(q => q.difficulty === 'easy'),
    medium: filteredQuestions.filter(q => q.difficulty === 'medium'),
    hard: filteredQuestions.filter(q => q.difficulty === 'hard')
  };

  const renderQuestionCard = (q, index) => (
    <div key={q.id} className="question-card">
      <div className="card-header">
        <div className="q-meta">
          <span className="q-number">Question #{index + 1}</span>
          <span
            className="q-difficulty"
            style={{ color: getDifficultyColor(q.difficulty) }}
          >
            {q.difficulty?.toUpperCase() || "MEDIUM"}
          </span>
        </div>
        <div className="q-actions">
          <Link to={`/admin/subjects/${subjectId}/questions/edit/${q.id}`} className="action-btn edit">
            <Edit3 size={16} />
          </Link>
          <button onClick={() => deleteQuestion(q.id)} className="action-btn delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="q-content">
          <div className="content-label">
            <HelpCircle size={14} className="text-blue" />
            <span>Question</span>
          </div>
          <p>{q.question}</p>
          {q.image_url && (
            <div className="media-preview">
              <ImageIcon size={14} />
              <span>Image Attached</span>
            </div>
          )}
        </div>

        <div className="q-content answer">
          <div className="content-label">
            <CheckCircle2 size={14} className="text-green" />
            <span>Answer</span>
          </div>
          <p>{q.correct}</p>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    fetchQuestions();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="list-page">
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

  if (error || !subject) {
    return (
      <div className="list-page">
        <div className="auth-mesh"></div>
        <div className="error-container">
          <p>{error || "Subject not found"}</p>
          <Link to="/admin/subjects" className="btn-back">
            <ArrowLeft size={16} /> Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="list-page">
      <div className="auth-mesh"></div>

      <main className="list-main">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">

              <h1>{subject.name}</h1>
              <p>Manage flashcards and questions for this subject</p>
            </div>
            <Link to={`/admin/subjects/${subjectId}/questions/add`} className="btn-primary">
              <Plus size={18} />
              Add New Question
            </Link>
          </div>
        </div>

        {/* Questions Grid */}
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {(!subject.flashcards || subject.flashcards.length === 0) ? (
          <div className="empty-state">
            <BookOpen size={64} className="empty-icon" />
            <h3>No questions found</h3>
            <p>Start building your question bank for {subject.name}</p>
            <Link to={`/admin/subjects/${subjectId}/questions/add`} className="btn-primary">
              Add Your First Question
            </Link>
          </div>
        ) : searchQuery ? (
          // Show flat list when searching
          <div className="questions-grid">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, i) => renderQuestionCard(q, i))
            ) : (
              <div className="no-results">
                <p>No questions found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          // Show Categorized Sections
          <div className="sections-container">
            {/* Easy Section */}
            {groupedQuestions.easy.length > 0 && (
              <section className="difficulty-section">
                <h3 className="section-title easy">Easy Questions ({groupedQuestions.easy.length})</h3>
                <div className="questions-grid">
                  {groupedQuestions.easy.map((q, i) => renderQuestionCard(q, i))}
                </div>
              </section>
            )}

            {/* Medium Section */}
            {groupedQuestions.medium.length > 0 && (
              <section className="difficulty-section">
                <h3 className="section-title medium">Medium Questions ({groupedQuestions.medium.length})</h3>
                <div className="questions-grid">
                  {groupedQuestions.medium.map((q, i) => renderQuestionCard(q, i))}
                </div>
              </section>
            )}

            {/* Hard Section */}
            {groupedQuestions.hard.length > 0 && (
              <section className="difficulty-section">
                <h3 className="section-title hard">Hard Questions ({groupedQuestions.hard.length})</h3>
                <div className="questions-grid">
                  {groupedQuestions.hard.map((q, i) => renderQuestionCard(q, i))}
                </div>
              </section>
            )}

            {/* Empty State if populated but everything filtered out (edge case) */}
            {Object.values(groupedQuestions).flat().length === 0 && (
              <div className="no-results">
                <p>No questions categorized.</p>
              </div>
            )}
          </div>
        )}


        <div className="page-footer">
          <Link to="/admin/subjects" className="btn-back">
            <ArrowLeft size={16} />
            Back to Subjects
          </Link>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .list-page {
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

        .list-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem 6rem;
          position: relative;
          z-index: 1;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 3rem;
          display: flex;
          justify-content: flex-start;
        }

        .search-bar {
          position: relative;
          width: 100%;
          max-width: 500px;
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
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
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

        /* Sections */
        .sections-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .difficulty-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          padding-left: 1rem;
          border-left: 4px solid;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-title.easy { border-color: #4ade80; color: #4ade80; }
        .section-title.medium { border-color: #fbbf24; color: #fbbf24; }
        .section-title.hard { border-color: #f87171; color: #f87171; }

        .no-results {
          text-align: center;
          padding: 4rem;
          color: #94a3b8;
          font-style: italic;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }



        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .header-left p {
          color: #64748b;
          margin: 0;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          white-space: nowrap;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        /* Grid */
        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .question-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          transition: 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .question-card:hover {
          background: #ffffff;
          transform: translateY(-4px);
          border-color: #38bdf8;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          padding: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .q-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .q-number {
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        .q-difficulty {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          background: #f1f5f9;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .q-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
          color: #94a3b8;
          background: transparent;
        }

        .action-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .action-btn.delete:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .content-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .q-content p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #1e293b;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .q-content.answer p {
          color: #475569;
        }

        .media-preview {
          margin-top: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 8px;
          color: #38bdf8;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 24px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          color: #38bdf8;
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .empty-state p {
          color: #64748b;
          margin: 0 0 2rem 0;
        }

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

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 1rem;
          color: #ef4444;
        }

        /* Footer */
        .page-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: center;
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

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .text-blue { color: #38bdf8; }
        .text-green { color: #4ade80; }

        @media (max-width: 640px) {
          .list-main { padding: 1.5rem; }
          .header-content { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .questions-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default QuestionList;
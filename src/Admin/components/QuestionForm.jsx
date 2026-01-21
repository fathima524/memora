import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import {
  Save,
  X,
  Image as ImageIcon,
  Upload,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Type,
  ArrowLeft,
  Loader
} from 'lucide-react';

const QuestionForm = () => {
  const { id: subjectId, qid } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [correct, setCorrect] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [explanation, setExplanation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [answerImageUrl, setAnswerImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!qid);

  const handleImageUpload = async (e, type = 'question') => {
    const file = e.target.files[0];
    if (!file) return;

    const filePath = `flashcards/${Date.now()}-${type}-${file.name}`;
    setLoading(true);

    try {
      const { error } = await supabase.storage
        .from("flashcards-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("flashcards-images")
        .getPublicUrl(filePath);

      if (type === 'question') {
        setImageUrl(publicUrl);
      } else {
        setAnswerImageUrl(publicUrl);
      }
    } catch (error) {
      console.error("Image upload error:", error.message);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      if (qid) {
        setFetching(true);
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
          setImageUrl(data.image_url || "");
          setAnswerImageUrl(data.answer_image_url || "");
          setFetching(false);
        }
      }
    };

    fetchQuestion();
  }, [qid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        image_url: imageUrl,
        answer_image_url: answerImageUrl,
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
    } finally {
      setLoading(false);
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

            <h1>{qid ? "Edit Flashcard" : "Create New Flashcard"}</h1>
            <p>Fill in the details below to {qid ? "update the" : "create a new"} flashcard.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-form">
            {/* Question Section */}
            <div className="form-section">
              <div className="section-title">
                <HelpCircle size={18} className="text-blue" />
                <h3>Question Details</h3>
              </div>

              <div className="input-group">
                <label>Question Text</label>
                <div className="input-wrapper">
                  <Type size={16} className="input-icon" />
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    placeholder="e.g., What is the primary function of the mitochondria?"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Difficulty Level</label>
                  <div className="select-wrapper">
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="form-section">
              <div className="section-title">
                <CheckCircle2 size={18} className="text-green" />
                <h3>Answer & Explanation</h3>
              </div>

              <div className="input-group">
                <label>Correct Answer</label>
                <div className="input-wrapper">
                  <FileText size={16} className="input-icon" />
                  <textarea
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    rows={3}
                    required
                    placeholder="Enter the correct answer here..."
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Explanation (Optional)</label>
                <div className="input-wrapper">
                  <AlertCircle size={16} className="input-icon" />
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                    placeholder="Add extra context or explanation..."
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="form-section">
              <div className="section-title">
                <ImageIcon size={18} className="text-purple" />
                <h3>Media Attachments</h3>
              </div>

              <div className="grid-2">
                <div className="upload-box">
                  <label>Question Image</label>
                  <div className="upload-area">
                    {imageUrl ? (
                      <div className="preview-container">
                        <img src={imageUrl} alt="Question" />
                        <button type="button" onClick={() => setImageUrl("")} className="remove-btn">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={24} />
                        <span>Upload Image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'question')} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="upload-box">
                  <label>Answer Image</label>
                  <div className="upload-area">
                    {answerImageUrl ? (
                      <div className="preview-container">
                        <img src={answerImageUrl} alt="Answer" />
                        <button type="button" onClick={() => setAnswerImageUrl("")} className="remove-btn">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={24} />
                        <span>Upload Image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'answer')} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={18} />
                    {qid ? "Update Flashcard" : "Save Flashcard"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>


        <div className="page-footer">
          <Link to={`/admin/subjects/${subjectId}/questions`} className="btn-back">
            <ArrowLeft size={16} />
            Back to Questions
          </Link>
        </div>
      </main >

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
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
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
          margin-bottom: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
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

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 1rem;
          color: #64748b;
          pointer-events: none;
        }

        .input-wrapper input,
        .input-wrapper textarea,
        .select-wrapper select {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          color: #0f172a;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .input-wrapper textarea {
          resize: vertical;
          min-height: 100px;
        }

        .select-wrapper select {
          padding-left: 1rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 16px;
        }

        .input-wrapper input:focus,
        .input-wrapper textarea:focus,
        .select-wrapper select:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
          outline: none;
          background: #ffffff;
        }

        /* Upload Area */
        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: 0.2s;
          background: #f1f5f9;
        }

        .upload-area:hover {
          border-color: #38bdf8;
          background: #eff6ff;
        }

        .upload-placeholder {
          text-align: center;
          color: #64748b;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-placeholder input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .preview-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .remove-btn:hover {
          background: #ef4444;
        }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          border-top: 1px solid #e2e8f0;
          padding-top: 2rem;
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

        .text-blue { color: #38bdf8; }
        .text-green { color: #4ade80; }
        .text-purple { color: #a78bfa; }

        @media (max-width: 640px) {
          .glass-form {
            padding: 1.5rem;
          }
          .grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .form-actions {
            flex-direction: column-reverse;
          }
          .btn-cancel, .btn-submit {
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
      `}</style>
    </div >
  );
};

export default QuestionForm;
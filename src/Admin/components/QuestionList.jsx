import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

const QuestionList = () => {
  const { id: subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/subjects");
      const sub = res.data.find((s) => s.id === subjectId);
      setSubject(sub);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/subjects/${subjectId}/questions/${questionId}`);
        fetchQuestions();
      } catch (err) {
        console.error(err);
        alert('Error deleting question');
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [subjectId]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif"
  };

  const cardStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: '2.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    letterSpacing: '-0.025em'
  };

  const buttonPrimaryStyle = {
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
  };

  const questionCardStyle = {
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.15s ease'
  };

  const questionTextStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1rem',
    lineHeight: '1.5'
  };

  const metaStyle = {
    fontSize: '0.8rem',
    color: '#718096',
    marginBottom: '0.75rem'
  };

  const optionsStyle = {
    fontSize: '0.9rem',
    color: '#4a5568',
    marginBottom: '1rem',
    lineHeight: '1.4'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem'
  };

  const buttonSecondaryStyle = {
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
  };

  const buttonDangerStyle = {
    padding: '0.5rem 1rem',
    background: '#fed7d7',
    color: '#c53030',
    border: '1px solid #feb2b2',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#48bb78';
      case 'medium': return '#ed8936';
      case 'hard': return '#f56565';
      default: return '#4299e1';
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#4a5568'}}>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#e53e3e'}}>Subject not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Questions for {subject.name}</h2>
          <Link 
            to={`/admin/subjects/${subjectId}/questions/add`}
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            + Add New Question
          </Link>
        </div>

        {subject.questions.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#4a5568'}}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No questions found for this subject.</p>
            <Link to={`/admin/subjects/${subjectId}/questions/add`} style={buttonPrimaryStyle}>
              Add Your First Question
            </Link>
          </div>
        ) : (
          <>
            {subject.questions.map((q, index) => (
              <div 
                key={q.id} 
                style={questionCardStyle}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={metaStyle}>
                  Question #{index + 1} • 
                  <span style={{
                    color: getDifficultyColor(q.difficulty),
                    fontWeight: '600',
                    marginLeft: '0.5rem'
                  }}>
                    {q.difficulty.toUpperCase()}
                  </span>
                </div>
                <div style={questionTextStyle}>{q.question}</div>
                <div style={optionsStyle}>
                  <strong>Options:</strong> {q.options.join(" | ")}
                </div>
                <div style={optionsStyle}>
                  <strong>Correct Answer:</strong> 
                  <span style={{color: '#48bb78', fontWeight: '600', marginLeft: '0.5rem'}}>
                    {q.options[q.correct]}
                  </span>
                </div>
                {q.explanation && (
                  <div style={optionsStyle}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
                <div style={actionButtonsStyle}>
                  <Link 
                    to={`/admin/subjects/${subjectId}/questions/edit/${q.id}`}
                    style={buttonSecondaryStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f7fafc';
                      e.target.style.borderColor = '#cbd5e0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteQuestion(q.id)}
                    style={buttonDangerStyle}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#feb2b2';
                      e.target.style.color = '#9b2c2c';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#fed7d7';
                      e.target.style.color = '#c53030';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{paddingTop: '2rem', borderTop: '1px solid #e2e8f0', marginTop: '2rem'}}>
          <Link 
            to="/admin/subjects"
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = '#f7fafc';
              e.target.style.borderColor = '#cbd5e0';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            ← Back to Subjects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
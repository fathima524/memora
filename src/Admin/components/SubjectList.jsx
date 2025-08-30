import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also delete all associated questions.')) {
      try {
        await api.delete(`/subjects/${id}`);
        fetchSubjects();
      } catch (err) {
        console.error(err);
        alert('Error deleting subject');
      }
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif"
  };

  const cardStyle = {
    maxWidth: '1000px',
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

  const subjectCardStyle = {
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.15s ease'
  };

  const subjectNameStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.5rem'
  };

  const subjectMetaStyle = {
    fontSize: '0.875rem',
    color: '#4a5568',
    marginBottom: '1rem'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
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

  const statsStyle = {
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: '500'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#4a5568'}}>Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Subject Management</h2>
          <Link 
            to="/admin/subjects/add"
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
            + Add New Subject
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#4a5568'}}>
            <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>No subjects found.</p>
            <Link to="/admin/subjects/add" style={buttonPrimaryStyle}>
              Add Your First Subject
            </Link>
          </div>
        ) : (
          <>
            {subjects.map((sub) => (
              <div 
                key={sub.id} 
                style={subjectCardStyle}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={subjectNameStyle}>{sub.name}</div>
                <div style={subjectMetaStyle}>
                  <span style={statsStyle}>Subject ID: {sub.id}</span>
                  {sub.questions && (
                    <span style={{...statsStyle, marginLeft: '1rem'}}>
                      Questions: {sub.questions.length}
                    </span>
                  )}
                </div>
                <div style={actionButtonsStyle}>
                  <Link 
                    to={`/admin/subjects/${sub.id}/questions`}
                    style={{
                      ...buttonSecondaryStyle,
                      background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                      color: 'white',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
                    }}
                  >
                    📝 Manage Questions
                  </Link>
                  <Link 
                    to={`/admin/subjects/edit/${sub.id}`}
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
                    onClick={() => deleteSubject(sub.id)}
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
            to="/admin"
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
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
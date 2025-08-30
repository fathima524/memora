import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const SubjectForm = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    if (subjectId) {
      api.get("/subjects").then((res) => {
        const sub = res.data.find((s) => s.id === subjectId);
        if (sub) {
          setId(sub.id);
          setName(sub.name);
        }
      });
    }
  }, [subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (subjectId) {
        alert("Editing subject not implemented yet");
      } else {
        await api.post("/subjects", { id, name });
      }
      navigate("/admin/subjects");
    } catch (err) {
      console.error(err);
      alert("Error saving subject");
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 40%, #4a5568 70%, #718096 100%)',
    padding: '2rem',
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif"
  };

  const cardStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '8px',
    padding: '2.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(203, 213, 224, 0.5)'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '2rem',
    letterSpacing: '-0.025em',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '0.75rem'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.925rem',
    color: '#2d3748',
    background: 'white',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit'
  };

  const buttonPrimaryStyle = {
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
  };

  const buttonSecondaryStyle = {
    padding: '0.75rem 1.5rem',
    background: 'white',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.925rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{subjectId ? "Edit Subject" : "Add New Subject"}</h2>
        <form onSubmit={handleSubmit}>
          {!subjectId && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Subject ID</label>
              <input 
                style={inputStyle}
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                required 
                placeholder="Enter unique subject ID (e.g., anatomy, physiology)"
                onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Subject Name</label>
            <input 
              style={inputStyle}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter subject name (e.g., Human Anatomy)"
              onFocus={(e) => e.target.style.borderColor = '#4299e1'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div style={{paddingTop: '1rem', borderTop: '1px solid #e2e8f0'}}>
            <button 
              type="submit" 
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
              {subjectId ? "Update Subject" : "Add Subject"}
            </button>
            <button 
              type="button"
              style={buttonSecondaryStyle}
              onClick={() => navigate("/admin/subjects")}
              onMouseEnter={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.borderColor = '#cbd5e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
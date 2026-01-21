import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function CompleteProfile() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        navigate('/login');
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from('profiles')
        .select('profile_completed, full_name, year_of_study')
        .eq('id', session.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            role: 'student',
            profile_completed: false
          })
          .select()
          .single();

        if (insertError) return;
        if (newProfile?.profile_completed) navigate('/dashboard');
      } else if (!error && data?.profile_completed) {
        navigate('/dashboard');
      } else if (data) {
        setName(data.full_name || '');
        setYear(data.year_of_study || '');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !year) {
      alert("Please complete all fields!");
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: name.trim(),
          year_of_study: year,
          profile_completed: true,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileData?.role === 'admin') navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="auth-mesh"></div>

      <div className="onboarding-card glass-panel">
        <div className="brand-header">
          <span className="brand-logo">🩺</span>
          <span className="brand-name">Memora</span>
        </div>

        <div className="onboarding-text">
          <h1>Final Steps</h1>
          <p>Complete your profile to personalize your medical revision journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="Dr. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Current Status / Year</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              required
              className="premium-select"
            >
              <option value="">Select your stage...</option>
              <option value="1st Year">1st Year MBBS</option>
              <option value="2nd Year">2nd Year MBBS</option>
              <option value="3rd Year">3rd Year MBBS</option>
              <option value="Final Year">Final Year MBBS</option>
              <option value="Intern">Intern / Resident</option>
              <option value="Post-Grad">Post-Graduate</option>
            </select>
          </div>

          <button type="submit" className="btn-finish" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Start My Journey'}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .onboarding-container {
          min-height: 100vh;
          width: 100vw;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .auth-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 50%);
          z-index: 1;
        }

        .glass-panel {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 36px;
          padding: 4rem;
          position: relative;
          z-index: 10;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 500px;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          justify-content: center;
        }

        .brand-logo { font-size: 1.75rem; }
        .brand-name { font-weight: 800; font-size: 1.5rem; color: white; letter-spacing: -1px; }

        .onboarding-text {
          text-align: center;
          margin-bottom: 3rem;
        }

        .onboarding-text h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.75rem;
          letter-spacing: -1.5px;
        }

        .onboarding-text p {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #cbd5e1;
          margin-left: 0.25rem;
        }

        .form-group input, .premium-select {
          padding: 1.125rem 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
        }

        .form-group input:focus, .premium-select:focus {
          border-color: #2563eb;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .btn-finish {
          background: #2563eb;
          color: white;
          padding: 1.25rem;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-finish:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 20px 30px -5px rgba(37, 99, 235, 0.5);
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .glass-panel {
            padding: 3rem 2rem;
            border-radius: 28px;
            border: none;
            background: rgba(30, 41, 59, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
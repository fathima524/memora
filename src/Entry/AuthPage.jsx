import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, signUpWithEmail, signInWithGoogle, logout } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';

export default function AuthPage({ type = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await loginWithEmail(email, password);
        if (error) {
          alert(error.message);
        } else {
          // Check user role and redirect accordingly
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, profile_completed')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            navigate('/complete-profile');
          } else if (!profile.profile_completed) {
            navigate('/complete-profile');
          } else if (profile?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, role);
        if (error) {
          alert(error.message);
        } else {
          alert('Account created successfully! Please check your email for verification.');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        alert(error.message);
        setLoading(false);
      }
      // Note: Google login will redirect automatically, so we don't set loading to false here
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'} to Flash-doc</h1>

        <div className="auth-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
          />

          {!isLogin && (
            <>
              <label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="auth-select">
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

          <button onClick={handleSubmit} className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>

          <button onClick={handleGoogleLogin} className="auth-button google" disabled = {loading}>
            {loading ? 'Please wait...' : `${isLogin ? 'Login' : 'Sign Up'} with Google`}
          </button>

          <p className="switch-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              className="switch-link"
              onClick={() => navigate(isLogin ? '/signup' : '/login')}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
        }
        .auth-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
        }
        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #3c4b5c;
          text-align: center;
          margin-bottom: 30px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .auth-input, .auth-select {
          width: 100%;
          padding: 16px;
          border: 2px solid #e8eaec;
          border-radius: 12px;
          font-size: 16px;
          color: #3c4b5c;
          background-color: rgba(255, 255, 255, 0.8);
          outline: none;
        }
        .auth-input:focus, .auth-select:focus {
          border-color: #5a6b7a;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(90, 107, 122, 0.1);
        }
        .auth-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        .auth-button.google {
          background: #db4437;
        }
        .auth-button:hover {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
        }
        .switch-text {
          text-align: center;
          color: #5a6b7a;
          font-size: 14px;
        }
        .switch-link {
          color: #3c4b5c;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
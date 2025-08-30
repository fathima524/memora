import React, { useState, useEffect } from 'react';
import { loginWithEmail, signInWithGoogle, logout } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle email login
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { data, error } = await loginWithEmail(email, password);
    if (error) {
      alert(error.message);
    } else {
      redirectUser(data.user.id);
    }
    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  // Redirect user based on role
  const redirectUser = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (data?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  // Auto-login if session exists
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        redirectUser(data.session.user.id);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">Login to Flash-doc</h1>
        <div className="login-form">
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
          />
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">Login</button>
          <button onClick={handleLogin} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button onClick={handleGoogleLogin} className="login-button">
            {loading ? 'Please wait...' : 'Login with Google'}
          </button>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
        }
        .login-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
        }
        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #3c4b5c;
          text-align: center;
          margin-bottom: 30px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-label {
          font-size: 14px;
          font-weight: 600;
          color: #5a6b7a;
        }
        .login-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e8eaec;
          border-radius: 12px;
          font-size: 16px;
          color: #3c4b5c;
          background-color: rgba(255, 255, 255, 0.8);
          outline: none;
        }
        .login-input:focus {
          border-color: #5a6b7a;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(90, 107, 122, 0.1);
        }
        .login-button {
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
        .login-button:hover {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { signUpWithEmail } from '../supabase/auth';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default role
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { data, error } = await signUpWithEmail(email, password, role);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for verification!');
      navigate('/login'); // redirect to login after signup
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1 className="signup-title">Sign Up for Flash-doc</h1>
        <div className="signup-form">
          <label className="signup-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="signup-input"
          />

          <label className="signup-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="signup-input"
          />

          <label className="signup-label">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="signup-select"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={handleSignUp} className="signup-button">
            Sign Up
          </button>
        </div>
      </div>

      <style>{`
        .signup-page {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
        }
        .signup-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
        }
        .signup-title {
          font-size: 28px;
          font-weight: 700;
          color: #3c4b5c;
          text-align: center;
          margin-bottom: 30px;
        }
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .signup-label {
          font-size: 14px;
          font-weight: 600;
          color: #5a6b7a;
        }
        .signup-input, .signup-select {
          width: 100%;
          padding: 16px;
          border: 2px solid #e8eaec;
          border-radius: 12px;
          font-size: 16px;
          color: #3c4b5c;
          background-color: rgba(255, 255, 255, 0.8);
          outline: none;
        }
        .signup-input:focus, .signup-select:focus {
          border-color: #5a6b7a;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(90, 107, 122, 0.1);
        }
        .signup-button {
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
        .signup-button:hover {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
        }
      `}</style>
    </div>
  );
}

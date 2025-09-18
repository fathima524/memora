import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    if (!password) {
      alert('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const access_token = searchParams.get('access_token'); // Supabase sends this in URL

    const { error } = await supabase.auth.updateUser({
      password
    }, { accessToken: access_token });

    if (error) {
      alert(error.message);
    } else {
      alert('Password updated successfully! You can now login.');
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">Set New Password</h1>

        <div className="auth-form">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="auth-input"
          />

          <button onClick={handleUpdatePassword} className="auth-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .auth-page {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-size: cover;
          padding: 20px;
          margin: 0;
          position: relative;
        }

        .auth-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: #3c4b5c;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-form label {
          font-size: 14px;
          font-weight: 600;
          color: #3c4b5c;
          margin-bottom: -15px;
        }

        .auth-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e8eaec;
          border-radius: 12px;
          font-size: 16px;
          color: #3c4b5c;
          background-color: rgba(255, 255, 255, 0.8);
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .auth-input:focus {
          border-color: #5a6b7a;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(90, 107, 122, 0.1);
          transform: translateY(-1px);
        }

        .auth-input::placeholder {
          color: #8b9da9;
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
          transition: all 0.3s ease;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(60, 75, 92, 0.4);
        }

        .auth-button:active:not(:disabled) {
          transform: translateY(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .auth-page {
            padding: 15px;
          }
          
          .auth-box {
            padding: 40px 30px;
            max-width: calc(100vw - 30px);
            border-radius: 18px;
          }
          
          .auth-title {
            font-size: 26px;
            margin-bottom: 25px;
          }
          
          .auth-form {
            gap: 18px;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 10px;
          }
          
          .auth-box {
            padding: 35px 25px;
            max-width: calc(100vw - 20px);
            border-radius: 15px;
          }
          
          .auth-title {
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          .auth-form {
            gap: 16px;
          }
          
          .auth-input {
            padding: 14px;
            font-size: 16px;
          }
          
          .auth-button {
            padding: 14px;
            font-size: 16px;
          }
        }

        @media (max-width: 375px) {
          .auth-page {
            padding: 8px;
          }
          
          .auth-box {
            padding: 30px 20px;
            max-width: calc(100vw - 16px);
            border-radius: 12px;
          }
          
          .auth-title {
            font-size: 22px;
            margin-bottom: 18px;
          }
          
          .auth-form {
            gap: 15px;
          }
          
          .auth-form label {
            font-size: 13px;
            margin-bottom: -12px;
          }
          
          .auth-input {
            padding: 12px;
            font-size: 15px;
          }
          
          .auth-button {
            padding: 12px;
            font-size: 15px;
          }
        }

        @media (max-width: 320px) {
          .auth-page {
            padding: 5px;
          }
          
          .auth-box {
            padding: 25px 15px;
            max-width: calc(100vw - 10px);
            border-radius: 10px;
          }
          
          .auth-title {
            font-size: 20px;
            margin-bottom: 15px;
          }
          
          .auth-form {
            gap: 14px;
          }
          
          .auth-form label {
            font-size: 12px;
            margin-bottom: -10px;
          }
          
          .auth-input {
            padding: 10px;
            font-size: 14px;
          }
          
          .auth-button {
            padding: 10px;
            font-size: 14px;
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1200px) {
          .auth-box {
            max-width: 450px;
            padding: 60px;
          }
          
          .auth-title {
            font-size: 30px;
            margin-bottom: 35px;
          }
          
          .auth-form {
            gap: 22px;
          }
          
          .auth-input {
            padding: 18px;
            font-size: 17px;
          }
          
          .auth-button {
            padding: 18px;
            font-size: 17px;
          }
        }

        /* Landscape orientation on mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .auth-page {
            padding: 10px;
          }
          
          .auth-box {
            padding: 25px 35px;
            max-width: 90vw;
            max-height: 95vh;
            overflow-y: auto;
          }
          
          .auth-title {
            font-size: 22px;
            margin-bottom: 15px;
          }
          
          .auth-form {
            gap: 12px;
          }
          
          .auth-input {
            padding: 12px;
          }
          
          .auth-button {
            padding: 12px;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          .auth-box {
            border: 0.5px solid rgba(255, 255, 255, 0.3);
          }
          
          .auth-input {
            border-width: 1px;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .auth-input, .auth-button {
            transition: none;
          }
          
          .auth-button:hover:not(:disabled) {
            transform: none;
          }
          
          .auth-input:focus {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .auth-box {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
          }
        }

        /* Focus indicators for keyboard navigation */
        .auth-button:focus-visible {
          outline: 2px solid #5a6b7a;
          outline-offset: 2px;
        }

        .auth-input:focus-visible {
          outline: 2px solid #5a6b7a;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
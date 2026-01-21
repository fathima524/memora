import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, signUpWithEmail, signInWithGoogle } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';
import { Mail, Lock, ArrowRight, Chrome, CheckCircle2, Star, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

export default function AuthPage({ type = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const ensureUserProfile = async (userId, userEmail) => {
    try {
      let { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') throw selectError;

      if (!existingProfile) {
        const profileData = {
          id: userId,
          email: userEmail,
          role: 'student',
          profile_completed: false,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (insertError) throw insertError;
        return insertData;
      } else {
        const { data: updateResult, error: updateError } = await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) throw updateError;
        return updateResult;
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data: loginData, error } = await loginWithEmail(email, password);
        if (error) throw error;

        const profile = await ensureUserProfile(loginData.user.id, loginData.user.email);

        if (!profile.profile_completed) navigate('/complete-profile');
        else if (profile.role === 'admin') navigate('/admin');
        else navigate('/dashboard');

      } else {
        const { error } = await signUpWithEmail(email, password, 'student');
        if (error) throw error;
        alert('Check your email for verification!');
        navigate('/login');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-unified-wrapper">
      <div className="mesh-gradient"></div>

      <div className="auth-main-card">
        {/* Left Side: Brand Context */}
        <div className="info-side">
          <Link to="/" className="brand-logo">
            <span className="emoji">🩺</span>
            <span className="text">Memora</span>
          </Link>

          <div className="hero-messages">
            <h1>Master Medicine <br /><span>Better & Faster.</span></h1>
            <p>The premium study platform for medical students. Built for clinical excellence.</p>
          </div>

          <div className="feature-checks">
            <div className="check-item">
              <Sparkles size={18} />
              <span>Intelligent Spaced Repetition</span>
            </div>
            <div className="check-item">
              <ShieldCheck size={18} />
              <span>Verified High-Yield Content</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Form */}
        <div className="form-side">
          <div className="glass-form-card">
            <button onClick={() => navigate('/')} className="back-home-btn">
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <div className="form-head">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Continue your medical journey' : 'Join the medical community'}</p>
            </div>

            <form onSubmit={handleSubmit} className="unified-form">
              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={18} className="icon" />
                  <input
                    type="email"
                    placeholder="doctor@medical.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={18} className="icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="options-row">
                {isLogin && (
                  <Link to="/forgot-password" title="Coming Soon" className="forgot-link">Forgot Password?</Link>
                )}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <div className="loader"></div> : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <button onClick={handleGoogleLogin} className="btn-social" disabled={loading}>
              <Chrome size={20} />
              Continue with Google
            </button>

            <div className="switcher">
              <p>
                {isLogin ? "New to Memora?" : "Already a member?"}
                <button onClick={() => navigate(isLogin ? '/signup' : '/login')}>
                  {isLogin ? 'Create Account' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .auth-unified-wrapper {
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

        .mesh-gradient {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 1) 100%);
          z-index: 1;
        }

        .auth-main-card {
          width: 100%;
          max-width: 980px;
          min-height: 600px;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 36px;
          display: flex;
          z-index: 10;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        /* Left Side */
        .info-side {
          flex: 1;
          padding: 4.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 5rem;
        }

        .emoji { font-size: 1.75rem; }
        .text { font-size: 1.75rem; font-weight: 800; color: white; letter-spacing: -1px; }

        .hero-messages h1 {
          font-size: 2.75rem;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 2rem;
          letter-spacing: -1.5px;
        }

        .hero-messages h1 span {
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-messages p {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 3.5rem;
          max-width: 320px;
        }

        .feature-checks {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .check-item svg { color: #38bdf8; }

        /* Right Side / Form */
        .form-side {
          flex: 1.1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
        }

        .glass-form-card {
          width: 100%;
          max-width: 360px;
        }


        .back-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .back-home-btn:hover {
          color: #38bdf8;
          transform: translateX(-4px);
        }

        .form-head { margin-bottom: 2.5rem; }
        .form-head h2 { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 0.5rem; letter-spacing: -1px; }
        .form-head p { color: #94a3b8; font-size: 0.95rem; }

        .unified-form { display: flex; flex-direction: column; gap: 1.5rem; }

        .field-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 0.75rem;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon {
          position: absolute;
          left: 1.25rem;
          color: #64748b;
          transition: color 0.3s;
        }

        .input-wrap input {
          width: 100%;
          padding: 1rem 1.25rem 1rem 3.5rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrap input:focus {
          background: rgba(15, 23, 42, 0.6);
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-wrap input:focus + .icon {
          color: #38bdf8;
        }

        .options-row {
          display: flex;
          justify-content: flex-end;
        }

        .forgot-link {
          color: #38bdf8;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .btn-primary {
          margin-top: 1rem;
          background: #2563eb;
          color: white;
          padding: 1.125rem;
          border-radius: 16px;
          border: none;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 20px 30px -5px rgba(37, 99, 235, 0.5);
        }

        .divider {
          margin: 2rem 0;
          text-align: center;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .divider span {
          background: rgba(30, 41, 59, 1);
          padding: 0 1rem;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 800;
          position: relative;
        }

        .btn-social {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          color: white;
          font-weight: 700;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-social:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .switcher {
          margin-top: 2rem;
          text-align: center;
        }

        .switcher p {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .switcher button {
          background: none;
          border: none;
          color: #38bdf8;
          font-weight: 800;
          margin-left: 0.5rem;
          cursor: pointer;
          font-family: inherit;
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 960px) {
          .info-side { display: none; }
          .auth-main-card { max-width: 460px; min-height: auto; }
          .form-side { padding: 3rem; }
        }

        @media (max-width: 480px) {
          .auth-unified-wrapper { padding: 1rem; }
          .auth-main-card { border: none; box-shadow: none; background: rgba(15, 23, 42, 0.95); border-radius: 28px; }
          .form-side { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
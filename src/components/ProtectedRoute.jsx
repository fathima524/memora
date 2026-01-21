import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login');
          return;
        }

        // If they are on a verification flow, let them be
        if (!session.user.email_confirmed_at) {
          await supabase.auth.signOut();
          alert("Please verify your email before logging in.");
          navigate("/login");
          return;
        }

        setUser(session.user);

        // Try to fetch profile
        let profile;
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role, profile_completed')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) throw error;
          profile = data;
        } catch (err) {
          console.error('Error fetching profile:', err);
          profile = null;
        }

        // If no profile exists, create one (always student)
        if (!profile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || "",
              profile_completed: false,
              role: "student"
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            navigate('/login');
            return;
          }

          profile = newProfile;
        }

        // If profile is not completed, redirect
        if (!profile.profile_completed) {
          navigate('/complete-profile');
          return;
        }

        setUserRole(profile.role);

        // If required role is passed, check it
        if (requiredRole && profile.role !== requiredRole) {
          navigate('/dashboard');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="auth-loader-screen">
        <div className="auth-loader-mesh"></div>
        <div className="auth-loader-content">
          <div className="auth-loader-logo">
            <span className="logo-emoji">🩺</span>
            <div className="logo-pulse"></div>
          </div>
          <h2 className="auth-loader-title">Memora</h2>
          <p className="auth-loader-text">Preparing your medical dashboard...</p>
          <div className="auth-loader-bar">
            <div className="auth-loader-progress"></div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

          .auth-loader-screen {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0f172a;
            font-family: 'Plus Jakarta Sans', sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            overflow: hidden;
          }

          .auth-loader-mesh {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
              radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 40%);
            z-index: 1;
            animation: moveMesh 10s infinite alternate ease-in-out;
          }

          @keyframes moveMesh {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.1) translate(20px, 20px); }
          }

          .auth-loader-content {
            position: relative;
            z-index: 2;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .auth-loader-logo {
            position: relative;
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
          }

          .logo-emoji {
            font-size: 2rem;
            z-index: 1;
          }

          .logo-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(37, 99, 235, 0.2);
            border-radius: 24px;
            animation: pulseLogo 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
          }

          @keyframes pulseLogo {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 0.3; }
            100% { transform: scale(0.95); opacity: 0.8; }
          }

          .auth-loader-title {
            font-size: 2rem;
            font-weight: 800;
            color: white;
            letter-spacing: -1px;
            margin: 0;
          }

          .auth-loader-text {
            color: #94a3b8;
            font-size: 1rem;
            font-weight: 500;
          }

          .auth-loader-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 99px;
            overflow: hidden;
            margin-top: 0.5rem;
          }

          .auth-loader-progress {
            width: 40%;
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #38bdf8);
            border-radius: 99px;
            animation: slideProgress 1.5s infinite ease-in-out;
          }

          @keyframes slideProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

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
              role: "student" // 🔒 always student
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

        // If required role is passed, check it (but dashboard is same for all)
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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #27374d 0%, #526d82 40%, #9db2bf 70%, #dde6ed 100%)',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(39, 55, 77, 0.3)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #27374d',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#27374d', fontSize: '1.1rem', fontWeight: '600' }}>
            Checking authentication...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

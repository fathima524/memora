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

  // Helper function to get user email from auth
  const getUserEmail = async (userId) => {
    try {
      const { data: authUser, error } = await supabase.auth.admin.getUserById(userId);
      if (error) {
        console.error('Error fetching auth user:', error);
        return null;
      }
      return authUser?.user?.email || null;
    } catch (error) {
      console.error('Error in getUserEmail:', error);
      return null;
    }
  };

  // Helper function to create or update profile
  const ensureUserProfile = async (userId, userEmail, isNewUser = false) => {
    try {
      console.log('=== PROFILE CREATION DEBUG ===');
      console.log('User ID:', userId);
      console.log('User Email:', userEmail);
      console.log('Is New User:', isNewUser);
      
      // First, check if profile exists
      let { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Existing profile check:', { existingProfile, selectError });

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking existing profile:', selectError);
        throw selectError;
      }

      if (!existingProfile) {
        // Profile doesn't exist, create it
        console.log('=== CREATING NEW PROFILE ===');
        
        // Get email from current session if not provided
        if (!userEmail) {
          const { data: { session } } = await supabase.auth.getSession();
          userEmail = session?.user?.email;
        }

        console.log('Final email for profile creation:', userEmail);
        
        const profileData = {
          id: userId,
          email: userEmail,
          role: 'student',
          profile_completed: false,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        console.log('Profile data to insert:', profileData);

        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        console.log('Insert result:', { insertData, insertError });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          console.error('Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          
          // If insert fails, try to get current user data and retry
          if (insertError.code === '42501' || insertError.message?.includes('policy')) {
            console.log('RLS policy error, trying alternative approach...');
            
            // Try using upsert instead
            const { data: upsertData, error: upsertError } = await supabase
              .from('profiles')
              .upsert(profileData, {
                onConflict: 'id'
              })
              .select()
              .single();

            console.log('Upsert result:', { upsertData, upsertError });

            if (upsertError) {
              console.error('Upsert also failed:', upsertError);
              console.error('Upsert error details:', {
                code: upsertError.code,
                message: upsertError.message,
                details: upsertError.details,
                hint: upsertError.hint
              });
              throw upsertError;
            }
            return upsertData;
          }
          throw insertError;
        }
        
        console.log('Profile created successfully:', insertData);
        console.log('=== PROFILE CREATION SUCCESS ===');
        return insertData;
      } else {
        // Profile exists, update last_seen and email if missing
        console.log('=== UPDATING EXISTING PROFILE ===');
        console.log('Current profile:', existingProfile);
        
        const updateData = {
          last_seen: new Date().toISOString()
        };
        
        // Add email if it's missing in the profile
        if (!existingProfile.email && userEmail) {
          console.log('Adding missing email to existing profile:', userEmail);
          updateData.email = userEmail;
        }

        console.log('Update data:', updateData);

        const { data: updateResult, error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        console.log('Update result:', { updateResult, updateError });

        if (updateError) {
          console.error('Error updating profile:', updateError);
          console.error('Update error details:', {
            code: updateError.code,
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint
          });
          throw updateError;
        }

        console.log('Profile updated successfully:', updateResult);
        console.log('=== PROFILE UPDATE SUCCESS ===');
        return updateResult;
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      console.error('=== PROFILE OPERATION FAILED ===');
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login with email/password
        const { data: loginData, error } = await loginWithEmail(email, password);
        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        const userId = loginData?.user?.id;
        const userEmail = loginData?.user?.email;
        
        if (!userId) {
          console.error('User ID not found');
          setLoading(false);
          return;
        }

        console.log('Email/password login successful:', { userId, userEmail });

        // Ensure profile exists with email
        const profile = await ensureUserProfile(userId, userEmail || email);
        
        // Navigate based on profile
        if (!profile.profile_completed) {
          navigate('/complete-profile');
        } else if (profile.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }

      } else {
        // Sign up flow
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
      console.log('Starting Google authentication...');
      
      const { data: googleData, error } = await signInWithGoogle();
      if (error) {
        console.error('Google auth error:', error);
        alert(error.message);
        setLoading(false);
        return;
      }

      console.log('Google auth response:', googleData);

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get current session to ensure we have fresh data - retry if needed
      let session = null;
      let sessionError = null;
      
      for (let i = 0; i < 3; i++) {
        const { data: sessionData, error: err } = await supabase.auth.getSession();
        if (!err && sessionData.session) {
          session = sessionData.session;
          sessionError = null;
          break;
        }
        sessionError = err;
        console.log(`Session attempt ${i + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (sessionError || !session) {
        console.error('Session error after retries:', sessionError);
        throw sessionError || new Error('Could not establish session');
      }

      const userId = session.user?.id;
      const userEmail = session.user?.email;
      
      console.log('Session data:', { userId, userEmail, fullUser: session.user });

      if (!userId) {
        alert('Could not retrieve user information from Google. Please try again.');
        setLoading(false);
        return;
      }

      if (!userEmail) {
        console.warn('Email not found in session, checking auth metadata...');
        // Try to get email from user metadata
        const altEmail = session.user?.user_metadata?.email || 
                        session.user?.identities?.[0]?.identity_data?.email;
        console.log('Alternative email sources:', {
          metadata: session.user?.user_metadata?.email,
          identity: session.user?.identities?.[0]?.identity_data?.email
        });
        
        if (!altEmail) {
          alert('Could not retrieve email from Google. Please ensure you have granted email permission.');
          setLoading(false);
          return;
        }
      }

      // Ensure profile exists with retry mechanism
      let profile = null;
      let profileError = null;
      
      for (let i = 0; i < 3; i++) {
        try {
          profile = await ensureUserProfile(userId, userEmail, true);
          profileError = null;
          break;
        } catch (error) {
          profileError = error;
          console.log(`Profile creation attempt ${i + 1} failed:`, error.message);
          if (error.message?.includes('foreign key constraint')) {
            console.log('Foreign key constraint error, waiting for user to be fully created...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            break; // Don't retry for other types of errors
          }
        }
      }
      
      if (profileError) {
        console.error('Profile creation failed after retries:', profileError);
        throw profileError;
      }
      
      console.log('Final profile:', profile);

      // Navigate based on profile
      if (!profile.profile_completed) {
        navigate('/complete-profile');
      } else if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Google login error:', error);
      alert(`Google login failed: ${error.message}. Please try again.`);
    } finally {
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
              </select>
            </>
          )}

          {/* {isLogin && (
            <p
              className="forgot-password"
              style={{ cursor: 'pointer', color: '#3182ce', marginBottom: '1rem' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </p>
          )} */}

          <button onClick={handleSubmit} className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>

          <button onClick={handleGoogleLogin} className="auth-button google" disabled={loading}>
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

        .auth-input, .auth-select {
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

        .auth-input:focus, .auth-select:focus {
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

        .auth-button.google {
          background: linear-gradient(135deg, #db4437 0%, #c23321 100%);
          margin-top: 5px;
        }

        .auth-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(60, 75, 92, 0.4);
        }

        .auth-button.google:hover:not(:disabled) {
          background: linear-gradient(135deg, #c23321 0%, #a52714 100%);
          box-shadow: 0 8px 20px rgba(219, 68, 55, 0.4);
        }

        .auth-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .switch-text {
          text-align: center;
          color: #5a6b7a;
          font-size: 14px;
          line-height: 1.5;
          margin-top: 10px;
        }

        .switch-link {
          color: #3c4b5c;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .switch-link:hover {
          color: #2a3642;
          text-decoration: underline;
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
          
          .auth-input, .auth-select {
            padding: 14px;
            font-size: 16px;
          }
          
          .auth-button {
            padding: 14px;
            font-size: 16px;
          }
          
          .switch-text {
            font-size: 13px;
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
          
          .auth-input, .auth-select {
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
          
          .auth-input, .auth-select {
            padding: 10px;
            font-size: 14px;
          }
          
          .auth-button {
            padding: 10px;
            font-size: 14px;
          }
          
          .switch-text {
            font-size: 12px;
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
          
          .auth-input, .auth-select {
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
          
          .auth-input, .auth-select {
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
          
          .auth-input, .auth-select {
            border-width: 1px;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .auth-input, .auth-select, .auth-button, .switch-link {
            transition: none;
          }
          
          .auth-button:hover:not(:disabled) {
            transform: none;
          }
          
          .auth-input:focus, .auth-select:focus {
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

        .switch-link:focus-visible {
          outline: 2px solid #5a6b7a;
          outline-offset: 1px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
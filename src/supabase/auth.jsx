import { supabase } from './supabaseClient';

// Sign up (only handles auth, no profile insert yet)
export const signUpWithEmail = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/complete-profile`
    }
  });
};

// Complete Profile (called after login/redirect)
export const createProfile = async (role = 'student') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No authenticated user" };

  const { error } = await supabase.from('profiles').insert([
    {
      id: user.id,   // ✅ now matches auth.uid()
      email: user.email,
      role,
      profile_completed: false
    }
  ]);

  if (error) console.error("Error creating profile:", error);
  return { error };
};


// Login
export const loginWithEmail = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// Logout
export const logout = async () => {
  return await supabase.auth.signOut();
};

// Google login
export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
};
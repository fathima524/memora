import { supabase } from './supabaseClient';

// Sign up
export const signUpWithEmail = async (email, password, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/complete-profile`
    }
  });

  if (data?.user && !error) {
    // Insert role in 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      role: role || 'student'
    });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
  }

  return { data, error };
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
import { supabase } from './supabaseClient';

// Sign up
export const signUpWithEmail = async (email, password, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (data?.user && !error) {
    // Insert role in 'profiles' table
    await supabase.from('profiles').insert({
      id: data.user.id,
      role: role
    });
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
      redirectTo: 'http://localhost:3000/dashboard' // change for production
    }
  });
};

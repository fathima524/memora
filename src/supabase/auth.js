import { supabase } from './supabaseClient';

// Sign up
export const signUpWithEmail = async (email, password, role) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/complete-profile`,
        data: {
          role: role || 'student'
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return { data, error };
    }

    // Only create profile if user was created successfully
    if (data?.user) {
      // Insert role in 'profiles' table
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role: role || 'student'
      });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't return error here as user was created successfully
      }
    }

    return { data, error };
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return { data: null, error: err };
  }
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

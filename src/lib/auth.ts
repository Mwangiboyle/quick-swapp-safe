// src/lib/auth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import type { Profile } from './types';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export class AuthService {
  // Sign up new user
  static async signUp({ email, password, firstName, lastName }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign in user
  static async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }

    return session;
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(error.message);
    }

    if (!user) return null;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      profile: profile || undefined
    };
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Update email
  static async updateEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Resend confirmation email
  static async resendConfirmation(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  // Get university domain from email
  static getUniversityDomain(email: string): string {
    return email.split('@')[1];
  }

  // Check if user has verified email
  static async isEmailVerified(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email_confirmed_at != null;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Auth context helper
export const createAuthContext = () => {
  let currentUser: AuthUser | null = null;
  let isLoading = true;

  const updateUser = async () => {
    try {
      currentUser = await AuthService.getCurrentUser();
    } catch (error) {
      currentUser = null;
    } finally {
      isLoading = false;
    }
  };

  // Initialize
  updateUser();

  // Listen to auth changes
  AuthService.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      await updateUser();
    }
  });

  return {
    getCurrentUser: () => currentUser,
    isLoading: () => isLoading,
    updateUser,
  };
};

// Auth guard hook for protected routes
export const useAuthGuard = (redirectTo: string = '/signin') => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate(redirectTo);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, redirectTo]);

  return { isChecking, isAuthenticated };
};

// Helper functions for easy importing
export const signUp = AuthService.signUp.bind(AuthService);
export const signIn = AuthService.signIn.bind(AuthService);
export const signOut = AuthService.signOut.bind(AuthService);
export const getCurrentUser = AuthService.getCurrentUser.bind(AuthService);
export const resetPassword = AuthService.resetPassword.bind(AuthService);
export const isAuthenticated = AuthService.isAuthenticated.bind(AuthService);

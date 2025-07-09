import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar,
        bio: profile.bio,
        joinedAt: profile.joined_at,
        isActive: profile.is_active
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        if (userProfile && userProfile.isActive) {
          setUser(userProfile);
          setIsAuthenticated(true);
          return true;
        } else {
          console.error('User profile not found or inactive');
          await supabase.auth.signOut();
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, bio?: string, avatar?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            bio,
            avatar,
            role: 'author' // Default role for new registrations
          }
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // The profile will be created automatically by the trigger
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const canEdit = (postId: string): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'editor';
  };

  const canModerate = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'editor';
  };

  const canAdmin = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin';
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
    canEdit,
    canModerate,
    canAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext } from 'react';
import api from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types (matches Backend User model)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'member' | 'lead' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Use React Query for fetching current user (Session Check)
  // We use this as the single source of truth for the user state
  const { data: userData, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data.data;
      } catch (err) {
        return null; 
      }
    },
    retry: false, // Don't retry if 401
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Consider user data fresh for 5 minutes
  });

  const user = userData || null;

  const login = async (loginData: any) => {
    const res = await api.post('/auth/login', loginData);
    const userFromResponse = res.data.data || res.data.user;
    
    // Update the query data immediately
    if (userFromResponse) {
        queryClient.setQueryData(['authUser'], userFromResponse);
    }
    
    // Invalidate to be safe
    await queryClient.invalidateQueries({ queryKey: ['authUser'] });
  };

  const register = async (registerData: any) => {
    const res = await api.post('/auth/register', registerData);
    const userFromResponse = res.data.data || res.data.user;
    
    if (userFromResponse) {
        queryClient.setQueryData(['authUser'], userFromResponse);
    }
    await queryClient.invalidateQueries({ queryKey: ['authUser'] });
  };

  const logout = async () => {
    try {
        await api.get('/auth/logout');
    } catch (error) {
        console.error("Logout failed", error);
    }
    queryClient.setQueryData(['authUser'], null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types (matches Backend User model)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
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
  const [user, setUser] = useState<User | null>(null);

  // Use React Query for fetching current user (Session Check)
  const { data, isLoading, isError } = useQuery({
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
  });

  // Sync React Query data with local state
  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (isError || data === null) {
      setUser(null);
    }
  }, [data, isError]);

  const login = async (userData: any) => {
    const res = await api.post('/auth/login', userData);
    setUser(res.data.data || res.data.user); // Adapt based on exact backend response
    // Invalidate query to ensure data consistency
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
  };

  const register = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    setUser(res.data.data || res.data.user);
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
  };

  const logout = async () => {
    await api.get('/auth/logout'); // Assuming you implement a logout endpoint that clears cookie
    setUser(null);
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

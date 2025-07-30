import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, isSeller?: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  toggleLikedProduct: (productId: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  isSeller: boolean;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string, isSeller = false): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      const mockUser: AuthUser = {
        id: '1',
        name: email.split('@')[0],
        email,
        rating: 4.8,
        reviews: 234,
        isSeller,
        joinDate: '2020-01-15',
        location: 'New York, NY',
        likedProducts: []
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const mockUser: AuthUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      rating: 0,
      reviews: 0,
      isSeller: userData.isSeller,
      joinDate: new Date().toISOString().split('T')[0],
      location: userData.location,
      likedProducts: []
    };
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleLikedProduct = (productId: string) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      const isLiked = prev.likedProducts.includes(productId);
      return {
        ...prev,
        likedProducts: isLiked 
          ? prev.likedProducts.filter(id => id !== productId)
          : [...prev.likedProducts, productId]
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, toggleLikedProduct }}>
      {children}
    </AuthContext.Provider>
  );
};
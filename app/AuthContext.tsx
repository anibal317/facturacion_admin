// app/AuthContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser ] = useState<{ username: string; role: string } | null>(null);

  const login = (username: string, password: string) => {
    // Usuario hardcodeado
    const hardcodedUser  = { username: 'admin', password: 'admin', role: 'admin' };

    if (username === hardcodedUser .username && password === hardcodedUser .password) {
      setUser ({ username: hardcodedUser .username, role: hardcodedUser .role });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const logout = () => {
    setUser (null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
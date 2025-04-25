import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          const res = await fetch('https://crypto-demon-back.onrender.com/auth/user', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else if (res.status === 404) {
            setUser(null);
            localStorage.removeItem('user');
          } else {
            console.error('Помилка завантаження користувача:', await res.text());
          }
        } catch (err) {
          console.error('AuthContext error:', err);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth має використовуватись в межах AuthProvider');
  }
  return context;
};
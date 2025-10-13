import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardkodovani korisnici za demo (u produkciji bi ovo bilo u bazi)
const DEMO_USERS = [
  { username: 'admin', password: 'markovickop2025', email: 'admin@markovickop.rs' },
  { username: 'marko', password: 'vozila123', email: 'marko@markovickop.rs' },
  { username: 'test', password: 'test123', email: 'test@markovickop.rs' },
  { username: 'uros', password: 'uros123', email: 'uros@markovickop.rs' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Proveravamo da li je korisnik već ulogovan (iz localStorage)
    const savedUser = localStorage.getItem('markovickop_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('markovickop_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simuliramo API poziv
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = { username: foundUser.username, email: foundUser.email };
      setUser(userData);
      localStorage.setItem('markovickop_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('markovickop_user');
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    // Simuliramo API poziv
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Proveravamo da li je stara lozinka ispravna
    const foundUser = DEMO_USERS.find(u => u.username === user.username);
    if (!foundUser || foundUser.password !== oldPassword) {
      return false;
    }
    
    // Ažuriramo lozinku u DEMO_USERS (u produkciji bi ovo bilo u bazi)
    const userIndex = DEMO_USERS.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
      DEMO_USERS[userIndex].password = newPassword;
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

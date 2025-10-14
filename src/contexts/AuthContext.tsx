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
  addUser: (username: string, password: string, email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Korisnici se čuvaju u localStorage (besplatno, bez servera)
const USERS_KEY = 'markovickop_users';
function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(USERS_KEY);
    }
  }
  // Default korisnici
  return [
    { username: 'aca', password: 'aca123', email: 'aca@markovickop.rs' },
    { username: 'dejan', password: 'dejan123', email: 'dejan@markovickop.rs' },
    { username: 'laki', password: 'laki123', email: 'laki@markovickop.rs' },
    { username: 'uros', password: 'uros123', email: 'uros@markovickop.rs' },
  ];
}
function saveUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const foundUser = users.find(
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
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      return false;
    }
    users[userIndex].password = newPassword;
    saveUsers(users);
    return true;
  };

  const addUser = async (username: string, password: string, email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    if (users.some(u => u.username === username || u.email === email)) {
      return false; // korisnik već postoji
    }
    users.push({ username, password, email });
    saveUsers(users);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, addUser, isLoading }}>
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

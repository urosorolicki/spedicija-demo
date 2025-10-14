import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hashPassword, verifyPassword, sanitizeInput, loginRateLimiter, validatePasswordStrength } from '@/lib/security';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  addUser: (username: string, password: string, email: string) => Promise<{ success: boolean; error?: string }>;
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

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);
    
    // Rate limiting check
    if (!loginRateLimiter.checkLimit(cleanUsername)) {
      const remainingTime = loginRateLimiter.getRemainingTime(cleanUsername);
      return { 
        success: false, 
        error: `Previše neuspešnih pokušaja. Pokušajte ponovo za ${remainingTime} minuta.` 
      };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const foundUser = users.find(u => u.username === cleanUsername);
    
    if (!foundUser) {
      return { success: false, error: "Pogrešno korisničko ime ili lozinka" };
    }
    
    // Verify password (check if hashed or plain)
    let isValid = false;
    if (foundUser.password.length === 64) { // Hashed password
      isValid = await verifyPassword(cleanPassword, foundUser.password);
    } else { // Legacy plain password
      isValid = foundUser.password === cleanPassword;
      // Upgrade to hashed password
      if (isValid) {
        foundUser.password = await hashPassword(cleanPassword);
        saveUsers(users);
      }
    }
    
    if (isValid) {
      const userData = { username: foundUser.username, email: foundUser.email };
      setUser(userData);
      localStorage.setItem('markovickop_user', JSON.stringify(userData));
      loginRateLimiter.reset(cleanUsername); // Reset on successful login
      return { success: true };
    }
    
    return { success: false, error: "Pogrešno korisničko ime ili lozinka" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('markovickop_user');
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Niste ulogovani" };
    
    // Validate new password strength
    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === user.username);
    
    if (userIndex === -1) {
      return { success: false, error: "Korisnik nije pronađen" };
    }
    
    // Verify old password
    let isValid = false;
    if (users[userIndex].password.length === 64) {
      isValid = await verifyPassword(oldPassword, users[userIndex].password);
    } else {
      isValid = users[userIndex].password === oldPassword;
    }
    
    if (!isValid) {
      return { success: false, error: "Stara lozinka nije ispravna" };
    }
    
    // Hash and save new password
    users[userIndex].password = await hashPassword(newPassword);
    saveUsers(users);
    return { success: true };
  };

  const addUser = async (username: string, password: string, email: string): Promise<{ success: boolean; error?: string }> => {
    // Sanitize inputs
    const cleanUsername = sanitizeInput(username);
    const cleanEmail = sanitizeInput(email);
    
    // Validate password strength
    const validation = validatePasswordStrength(password);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    
    if (users.some(u => u.username === cleanUsername)) {
      return { success: false, error: "Korisničko ime već postoji" };
    }
    
    if (users.some(u => u.email === cleanEmail)) {
      return { success: false, error: "Email već postoji" };
    }
    
    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    users.push({ username: cleanUsername, password: hashedPassword, email: cleanEmail });
    saveUsers(users);
    return { success: true };
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

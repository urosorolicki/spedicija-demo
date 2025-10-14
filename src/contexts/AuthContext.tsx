import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, changeUserPassword, registerUser, getAllUsers, deleteUser as deleteUserService } from '@/services/authService';
import { validatePasswordStrength, loginRateLimiter } from '@/lib/security';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  addUser: (username: string, password: string, email: string) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => Promise<{ success: boolean; users?: any[]; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Proveravamo da li je korisnik već ulogovan (iz localStorage)
    const savedUser = localStorage.getItem('markovickop_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Proveri da li user objekat ima 'id' polje
        if (!parsedUser.id) {
          // Stari format bez id polja - izloguj korisnika
          console.warn('Old user format detected, clearing localStorage');
          localStorage.removeItem('markovickop_user');
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        localStorage.removeItem('markovickop_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    
    // Rate limiting check
    if (!loginRateLimiter.checkLimit(cleanUsername)) {
      const remainingTime = loginRateLimiter.getRemainingTime(cleanUsername);
      return { 
        success: false, 
        error: `Previše neuspešnih pokušaja. Pokušajte ponovo za ${remainingTime} minuta.` 
      };
    }
    
    // Call Appwrite login service
    const result = await loginUser(cleanUsername, cleanPassword);
    
    if (result.success && result.user) {
      const userData: User = {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
      };
      setUser(userData);
      localStorage.setItem('markovickop_user', JSON.stringify(userData));
      loginRateLimiter.reset(cleanUsername);
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Login failed' };
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
    
    // Call Appwrite change password service
    const result = await changeUserPassword(user.id, oldPassword, newPassword);
    return result;
  };

  const addUser = async (username: string, password: string, email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    
    // Validate password strength
    const validation = validatePasswordStrength(password);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }
    
    // Call Appwrite register service
    const result = await registerUser(cleanUsername, cleanEmail, password);
    return result;
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    const result = await deleteUserService(userId);
    return result;
  };

  const getAllUsersFunc = async (): Promise<{ success: boolean; users?: any[]; error?: string }> => {
    const result = await getAllUsers();
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      changePassword, 
      addUser, 
      deleteUser,
      getAllUsers: getAllUsersFunc,
      isLoading 
    }}>
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

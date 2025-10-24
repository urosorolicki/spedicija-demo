import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Koristi demo auth service umesto Appwrite za demo verziju
import { loginUser, registerUser, changeUserPassword, deleteUser as deleteUserService, getAllUsers } from '@/services/authService.demo';
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
    // Proveravamo da li je korisnik već ulogovan
    // Koristimo SAMO sessionStorage - briše se automatski kad se zatvori browser
    const savedUser = sessionStorage.getItem('spedicija_demo_user');
    const loginTimestamp = sessionStorage.getItem('spedicija_demo_login_time');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Check session expiration (1 hour of inactivity)
        if (loginTimestamp) {
          const loginTime = parseInt(loginTimestamp);
          const now = Date.now();
          const oneHourInMs = 60 * 60 * 1000; // 1 hour
          
          if (now - loginTime > oneHourInMs) {
            console.warn('Session expired after 1 hour of inactivity');
            sessionStorage.removeItem('spedicija_demo_user');
            sessionStorage.removeItem('spedicija_demo_login_time');
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        // Proveri da li user objekat ima 'id' polje
        if (!parsedUser.id) {
          console.warn('Old user format detected, clearing session');
          sessionStorage.removeItem('spedicija_demo_user');
          sessionStorage.removeItem('spedicija_demo_login_time');
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        sessionStorage.removeItem('spedicija_demo_user');
        sessionStorage.removeItem('spedicija_demo_login_time');
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
      // Čuvamo SAMO u sessionStorage - automatski se briše kad se zatvori browser
      sessionStorage.setItem('spedicija_demo_user', JSON.stringify(userData));
      sessionStorage.setItem('spedicija_demo_login_time', Date.now().toString());
      loginRateLimiter.reset(cleanUsername);
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Login failed' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('spedicija_demo_user');
    sessionStorage.removeItem('spedicija_demo_login_time');
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

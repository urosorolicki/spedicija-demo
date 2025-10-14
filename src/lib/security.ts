import DOMPurify from "dompurify";

// Password strength validation
export const validatePasswordStrength = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Lozinka mora imati najmanje 8 karaktera");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Lozinka mora sadržati bar jedno veliko slovo");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Lozinka mora sadržati bar jedno malo slovo");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Lozinka mora sadržati bar jedan broj");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Lozinka mora sadržati bar jedan specijalni karakter (!@#$%^&* itd.)");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  checkLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    
    const remaining = record.resetTime - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000 / 60) : 0;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter();

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// Sanitize object properties
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized: any = { ...obj };
  
  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    }
  });
  
  return sanitized as T;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation (alphanumeric + underscore)
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Secure password storage helper (simple hashing for localStorage)
export const hashPassword = async (password: string): Promise<string> => {
  // Using Web Crypto API for client-side hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Check if password matches hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Generate secure random token
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const sanitizedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, sanitizedValue);
    } catch (error) {
      console.error("Greška pri čuvanju podataka:", error);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Greška pri brisanju podataka:", error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Greška pri čišćenju podataka:", error);
    }
  },
};

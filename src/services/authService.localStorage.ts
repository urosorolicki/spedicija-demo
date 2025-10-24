// LocalStorage Auth Service za demo verziju
// Potpuno nezavisno od Appwrite - sve se čuva lokalno

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

// Demo korisnici - uvek dostupni
const getDefaultUsers = (): DemoUser[] => [
  { 
    id: '1', 
    username: 'admin', 
    password: 'admin123', 
    email: 'admin@demo.rs', 
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  { 
    id: '2', 
    username: 'menadzer', 
    password: 'menadzer123', 
    email: 'menadzer@demo.rs', 
    role: 'user',
    createdAt: new Date().toISOString()
  },
  { 
    id: '3', 
    username: 'vozac', 
    password: 'vozac123', 
    email: 'vozac@demo.rs', 
    role: 'user',
    createdAt: new Date().toISOString()
  },
  { 
    id: '4', 
    username: 'demo', 
    password: 'demo123', 
    email: 'demo@demo.rs', 
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// Ključevi za localStorage
const STORAGE_KEYS = {
  USERS: 'spedicija_demo_users',
  CURRENT_USER: 'spedicija_demo_current_user',
  LOGIN_TIME: 'spedicija_demo_login_time'
};

// Inicijalizuj korisnike ako ne postoje
const initializeUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getDefaultUsers()));
  }
};

// Dobij sve korisnike
const getUsers = (): DemoUser[] => {
  initializeUsers();
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : getDefaultUsers();
};

// Sačuvaj korisnike
const saveUsers = (users: DemoUser[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Login funkcija
 */
export async function loginUser(username: string, password: string) {
  try {
    // Simuliraj network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    // Uspešan login
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return { success: true, user: userData };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Greška pri prijavljivanju' };
  }
}

/**
 * Registracija novog korisnika
 */
export async function registerUser(username: string, email: string, password: string, role: string = 'user') {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    
    // Proveri da li korisnik već postoji
    const existingUser = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() || 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      return { success: false, error: 'Korisnik sa tim imenom ili email-om već postoji' };
    }

    // Kreiraj novog korisnika
    const newUser: DemoUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: 'Greška pri registraciji' };
  }
}

/**
 * Promena lozinke
 */
export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'Korisnik nije pronađen' };
    }

    const user = users[userIndex];
    if (user.password !== oldPassword) {
      return { success: false, error: 'Pogrešna stara lozinka' };
    }

    // Promeni lozinku
    users[userIndex].password = newPassword;
    saveUsers(users);
    
    return { success: true };
  } catch (error: any) {
    console.error('Change password error:', error);
    return { success: false, error: 'Greška pri promeni lozinke' };
  }
}

/**
 * Brisanje korisnika
 */
export async function deleteUser(userId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'Korisnik nije pronađen' };
    }

    users.splice(userIndex, 1);
    saveUsers(users);
    
    return { success: true };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, error: 'Greška pri brisanju korisnika' };
  }
}

/**
 * Dobijanje svih korisnika
 */
export async function getAllUsers() {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));

    const users = getUsers();
    
    return {
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })),
    };
  } catch (error: any) {
    console.error('Get all users error:', error);
    return { success: false, error: 'Greška pri dobijanju korisnika' };
  }
}

// Inicijalizuj korisnike kad se učita modul
initializeUsers();
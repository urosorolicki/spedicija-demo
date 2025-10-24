// Demo auth service koji koristi localStorage umesto Appwrite baze
// Ovo je za demo svrhe - u produkciji koristiti pravu bazu

interface DemoUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

// Demo korisnici
const DEMO_USERS: DemoUser[] = [
  { id: '1', username: 'admin', password: 'admin123', email: 'admin@demo.rs', role: 'admin' },
  { id: '2', username: 'user', password: 'user123', email: 'user@demo.rs', role: 'user' },
  { id: '3', username: 'demo', password: 'demo123', email: 'demo@demo.rs', role: 'user' },
];

// Jednostavan hash (samo za demo - u produkciji koristiti pravu hash funkciju)
function simpleHash(password: string): string {
  return btoa(password); // Base64 encoding kao demo hash
}

/**
 * Demo login funkcija koja koristi localStorage
 */
export async function loginUser(username: string, password: string) {
  try {
    // Simuliramo async operaciju
    await new Promise(resolve => setTimeout(resolve, 500));

    // Pronađi korisnika
    const user = DEMO_USERS.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    // Proveri lozinku (u demo verziji direktno poredimo)
    if (user.password !== password) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    // Uspešan login
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Demo login error:', error);
    return { success: false, error: 'Greška pri prijavljivanju' };
  }
}

/**
 * Demo registracija (samo dodaje u lokalnu listu)
 */
export async function registerUser(username: string, email: string, password: string, role: string = 'user') {
  try {
    // Proveri da li korisnik već postoji
    const existingUser = DEMO_USERS.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return { success: false, error: 'Korisnik sa tim imenom ili email-om već postoji' };
    }

    // Dodaj novog korisnika
    const newUser: DemoUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // U demo verziji čuvamo plain text
      role,
    };

    DEMO_USERS.push(newUser);

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
    console.error('Demo register error:', error);
    return { success: false, error: 'Greška pri registraciji' };
  }
}

/**
 * Demo promena lozinke
 */
export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
  try {
    const userIndex = DEMO_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'Korisnik nije pronađen' };
    }

    const user = DEMO_USERS[userIndex];
    if (user.password !== oldPassword) {
      return { success: false, error: 'Pogrešna stara lozinka' };
    }

    // Promeni lozinku
    DEMO_USERS[userIndex].password = newPassword;
    
    return { success: true };
  } catch (error: any) {
    console.error('Demo change password error:', error);
    return { success: false, error: 'Greška pri promeni lozinke' };
  }
}

/**
 * Demo brisanje korisnika
 */
export async function deleteUser(userId: string) {
  try {
    const userIndex = DEMO_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'Korisnik nije pronađen' };
    }

    DEMO_USERS.splice(userIndex, 1);
    return { success: true };
  } catch (error: any) {
    console.error('Demo delete user error:', error);
    return { success: false, error: 'Greška pri brisanju korisnika' };
  }
}

/**
 * Demo dobijanje svih korisnika
 */
export async function getAllUsers() {
  try {
    return {
      success: true,
      users: DEMO_USERS.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      })),
    };
  } catch (error: any) {
    console.error('Demo get all users error:', error);
    return { success: false, error: 'Greška pri dobijanju korisnika' };
  }
}

// Export demo korisnika za potrebe testiranja
export { DEMO_USERS };
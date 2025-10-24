import { registerUser } from './authService';

/**
 * Inicijalizacija default korisnika u Appwrite bazi
 * Pozovi ovu funkciju JEDNOM da kreiraš sve default korisnike
 */
export async function initializeDefaultUsers() {
  const defaultUsers = [
    { username: 'aca', password: 'aca123', email: 'aca@demo.rs', role: 'user' },
    { username: 'dejan', password: 'dejan123', email: 'dejan@demo.rs', role: 'user' },
    { username: 'laki', password: 'laki123', email: 'laki@demo.rs', role: 'user' },
    { username: 'uros', password: 'uros123', email: 'uros@demo.rs', role: 'admin' },
    { username: 'jovana', password: 'jovana123', email: 'jovana@demo.rs', role: 'user' },
  ];

  console.log('🚀 Inicijalizacija default korisnika...');

  for (const userData of defaultUsers) {
    const result = await registerUser(
      userData.username,
      userData.email,
      userData.password,
      userData.role
    );

    if (result.success) {
      console.log(`✅ Kreiran korisnik: ${userData.username}`);
    } else {
      console.log(`❌ Greška za ${userData.username}: ${result.error}`);
    }
  }

  console.log('✨ Inicijalizacija završena!');
}

// Samo za development - automatski pokreni inicijalizaciju
// KOMENTIRAJ OVO NAKON PRVOG POKRETANJA!
if (import.meta.env.DEV) {
  // Proveri da li su korisnici već kreirani
  const initialized = localStorage.getItem('appwrite_users_initialized');
  
  if (!initialized) {
    console.log('⚠️ Pokrećem inicijalizaciju default korisnika...');
    console.log('ℹ️ Korisnici su već kreirani. Ako želiš ponovo, obriši "appwrite_users_initialized" iz localStorage');
    // initializeDefaultUsers().then(() => {
    //   localStorage.setItem('appwrite_users_initialized', 'true');
    // });
  }
}

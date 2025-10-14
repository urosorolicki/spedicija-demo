import { ID, Query, Models } from 'appwrite';
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { hashPassword } from '@/lib/security';

export interface AppwriteUser extends Models.Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Registracija novog korisnika u Appwrite
 */
export async function registerUser(username: string, email: string, password: string, role: string = 'user') {
  try {
    // Hash password pre čuvanja
    const hashedPassword = await hashPassword(password);

    // Kreiraj dokument u users tabeli
    const user = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        username,
        email,
        password: hashedPassword,
        role,
      }
    );

    return { success: true, user };
  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login korisnika (provera username i password)
 */
export async function loginUser(username: string, password: string) {
  try {
    // Pronađi korisnika po username
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('username', username)]
    );

    if (response.documents.length === 0) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    const user = response.documents[0] as unknown as AppwriteUser;

    // Proveri password (hash)
    const hashedInputPassword = await hashPassword(password);
    
    if (user.password !== hashedInputPassword) {
      return { success: false, error: 'Pogrešno korisničko ime ili lozinka' };
    }

    // Uspešan login
    return {
      success: true,
      user: {
        id: user.$id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Promeni lozinku korisnika
 */
export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
  try {
    // Prvo proveri da li je stara lozinka tačna
    const user = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId) as unknown as AppwriteUser;

    const hashedOldPassword = await hashPassword(oldPassword);
    if (user.password !== hashedOldPassword) {
      return { success: false, error: 'Stara lozinka nije tačna' };
    }

    // Hash nova lozinka
    const hashedNewPassword = await hashPassword(newPassword);

    // Ažuriraj lozinku
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, userId, {
      password: hashedNewPassword,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Change password error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Dobavi sve korisnike (samo za admin)
 */
export async function getAllUsers() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS);
    return { success: true, users: response.documents as unknown as AppwriteUser[] };
  } catch (error: any) {
    console.error('Get users error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obriši korisnika (samo za admin)
 */
export async function deleteUser(userId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
    return { success: true };
  } catch (error: any) {
    console.error('Delete user error:', error);
    return { success: false, error: error.message };
  }
}

import { ID, Query, Models } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

export interface Materijal extends Models.Document {
  userId: string;
  datum: string;
  tip: 'ulaz' | 'izlaz';
  materijal: string;
  tezina: number;
  jedinica: string;
  cena?: number;
  lokacija?: string;
  vozac?: string;
  vozilo?: string;
  imageId?: string; // Appwrite Storage file ID (slika tereta)
}

/**
 * Dobavi sve materijale za određenog korisnika
 */
export async function getMaterijali(userId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.MATERIJAL,
      [Query.orderDesc('datum')]
    );
    return { success: true, materijali: response.documents as unknown as Materijal[] };
  } catch (error: any) {
    console.error('Get materijali error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Kreiraj novi materijal
 */
export async function createMaterijal(userId: string, data: Omit<Materijal, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>) {
  try {
    const materijal = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MATERIJAL,
      ID.unique(),
      {
        userId,
        ...data,
      }
    );
    return { success: true, materijal: materijal as unknown as Materijal };
  } catch (error: any) {
    console.error('Create materijal error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ažuriraj materijal
 */
export async function updateMaterijal(materijalId: string, data: Partial<Omit<Materijal, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>>) {
  try {
    const materijal = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MATERIJAL,
      materijalId,
      data
    );
    return { success: true, materijal: materijal as unknown as Materijal };
  } catch (error: any) {
    console.error('Update materijal error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obriši materijal
 */
export async function deleteMaterijal(materijalId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MATERIJAL, materijalId);
    return { success: true };
  } catch (error: any) {
    console.error('Delete materijal error:', error);
    return { success: false, error: error.message };
  }
}

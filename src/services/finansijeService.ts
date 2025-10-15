import { ID, Query, Models } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

export interface Finansija extends Models.Document {
  userId: string;
  datum: string;
  tip: 'prihod' | 'rashod';
  kategorija: string;
  iznos: number;
  opis?: string;
  vozilo?: string;
}

/**
 * Dobavi sve finansije za određenog korisnika
 */
export async function getFinansije(userId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FINANSIJE,
      [Query.orderDesc('datum')]
    );
    return { success: true, finansije: response.documents as unknown as Finansija[] };
  } catch (error: any) {
    console.error('Get finansije error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Kreiraj novu finansijsku transakciju
 */
export async function createFinansija(userId: string, data: Omit<Finansija, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>) {
  try {
    const finansija = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FINANSIJE,
      ID.unique(),
      {
        userId,
        ...data,
      }
    );
    return { success: true, finansija: finansija as unknown as Finansija };
  } catch (error: any) {
    console.error('Create finansija error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ažuriraj finansijsku transakciju
 */
export async function updateFinansija(finansijaId: string, data: Partial<Omit<Finansija, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>>) {
  try {
    const finansija = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FINANSIJE,
      finansijaId,
      data
    );
    return { success: true, finansija: finansija as unknown as Finansija };
  } catch (error: any) {
    console.error('Update finansija error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obriši finansijsku transakciju
 */
export async function deleteFinansija(finansijaId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FINANSIJE, finansijaId);
    return { success: true };
  } catch (error: any) {
    console.error('Delete finansija error:', error);
    return { success: false, error: error.message };
  }
}

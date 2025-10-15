import { ID, Query, Models } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

export interface Vozilo extends Models.Document {
  userId: string;
  naziv: string;
  registracija: string;
  tipVozila?: string;
  nosivost?: number;
  kilometraza?: number;
  godiste?: number;
  sledecaRevizijaGorivo?: string;
  sledecaRegistracija?: string;
  datumIstekaOsiguranja?: string;
  brojPoliseOsiguranja?: string;
  imageId?: string; // Appwrite Storage file ID
}

/**
 * Dobavi sva vozila za određenog korisnika
 */
export async function getVozila(userId: string) {
  try {
    console.log('[getVozila] Fetching all vozila (shared database)');
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.VOZILA,
      [Query.orderDesc('$createdAt')]
    );
    console.log('[getVozila] Found vozila:', response.documents.length, 'documents');
    return { success: true, vozila: response.documents as unknown as Vozilo[] };
  } catch (error: any) {
    console.error('Get vozila error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Kreiraj novo vozilo
 */
export async function createVozilo(userId: string, data: Omit<Vozilo, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>) {
  try {
    const vozilo = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.VOZILA,
      ID.unique(),
      {
        userId,
        ...data,
      }
    );
    return { success: true, vozilo: vozilo as unknown as Vozilo };
  } catch (error: any) {
    console.error('Create vozilo error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ažuriraj vozilo
 */
export async function updateVozilo(voziloId: string, data: Partial<Omit<Vozilo, '$id' | 'userId' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>>) {
  try {
    const vozilo = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.VOZILA,
      voziloId,
      data
    );
    return { success: true, vozilo: vozilo as unknown as Vozilo };
  } catch (error: any) {
    console.error('Update vozilo error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obriši vozilo
 */
export async function deleteVozilo(voziloId: string) {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.VOZILA, voziloId);
    return { success: true };
  } catch (error: any) {
    console.error('Delete vozilo error:', error);
    return { success: false, error: error.message };
  }
}

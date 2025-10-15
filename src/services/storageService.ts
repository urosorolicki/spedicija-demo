import { ID } from 'appwrite';
import { storage, STORAGE_BUCKET_ID } from '@/lib/appwrite';

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

/**
 * Upload image to Appwrite Storage
 */
export const uploadImage = async (file: File): Promise<UploadedImage> => {
  try {
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    const url = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id);

    return {
      id: response.$id,
      url: url.toString(),
      name: file.name,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Greška pri upload-u slike');
  }
};

/**
 * Delete image from Appwrite Storage
 */
export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Greška pri brisanju slike');
  }
};

/**
 * Get image URL from file ID
 */
export const getImageUrl = (fileId: string): string => {
  return storage.getFilePreview(STORAGE_BUCKET_ID, fileId).toString();
};

/**
 * Get file view URL (original size)
 */
export const getFileViewUrl = (fileId: string): string => {
  return storage.getFileView(STORAGE_BUCKET_ID, fileId).toString();
};

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
    console.log('[uploadImage] Starting upload for file:', file.name, 'Size:', file.size);
    
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    console.log('[uploadImage] Upload successful, file ID:', response.$id);

    const url = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id);
    
    console.log('[uploadImage] Preview URL:', url.toString());

    return {
      id: response.$id,
      url: url.toString(),
      name: file.name,
    };
  } catch (error) {
    console.error('[uploadImage] Error uploading image:', error);
    throw new Error('Greška pri upload-u slike');
  }
};

/**
 * Delete image from Appwrite Storage
 */
export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  } catch (error: any) {
    // If file doesn't exist (404), silently ignore
    if (error?.code === 404 || error?.type === 'storage_file_not_found') {
      console.warn('File not found in storage, already deleted:', fileId);
      return;
    }
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

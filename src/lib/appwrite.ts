import { Client, Databases, Account, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '68ee524400282a0de9e3';
export const COLLECTIONS = {
  USERS: 'users',
  VOZILA: 'vozila',
  FINANSIJE: 'finansije',
  MATERIJAL: 'materijal',
};

// Storage Bucket ID
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || '68efb145002481cb4fc6';

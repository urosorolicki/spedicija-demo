import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage, deleteImage, getImageUrl } from '@/services/storageService';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string; // fileId
  onChange: (fileId: string | null) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ value, onChange, label = "Slika", maxSizeMB = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ? getImageUrl(value) : null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Molim vas uploadujte samo slike (JPG, PNG, etc.)');
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    if (file.size > maxSize) {
      toast.error(`Slika je prevelika! Maksimalno ${maxSizeMB}MB.`);
      return;
    }

    // Create local preview immediately for instant feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      // Delete old image if exists (will silently fail if file not found)
      if (value) {
        try {
          await deleteImage(value);
        } catch (deleteError) {
          console.warn('Could not delete old image, continuing with upload:', deleteError);
        }
      }

      // Upload new image
      const uploaded = await uploadImage(file);
      setPreviewUrl(uploaded.url);
      setLocalPreview(null); // Clear local preview after successful upload
      onChange(uploaded.id);
      toast.success('Slika uspešno uploadovana!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Greška pri upload-u slike');
      setLocalPreview(null); // Clear local preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await deleteImage(value);
      setPreviewUrl(null);
      setLocalPreview(null);
      onChange(null);
      toast.success('Slika obrisana - sačuvaj promene');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Greška pri brisanju slike');
    }
  };

  // Show local preview during upload, then Appwrite URL after
  const displayImage = localPreview || previewUrl;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        {displayImage ? (
          <div className="relative">
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer h-48">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-2" />
                <p className="text-sm text-gray-500">Upload u toku...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Klikni ili prevuci sliku
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG do {maxSizeMB}MB
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}

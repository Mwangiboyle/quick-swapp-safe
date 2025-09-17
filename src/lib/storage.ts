// src/lib/storage.ts
import { supabase } from './supabaseClient';

export class StorageService {
  private static BUCKET_NAME = 'item_images';

  // Upload multiple item images
  static async uploadItemImages(files: FileList, itemId: string): Promise<string[]> {
    const uploadPromises = Array.from(files).map(async (file, index) => {
      return this.uploadFile(file, `${itemId}/${Date.now()}-${index}`);
    });

    return Promise.all(uploadPromises);
  }

  // Upload single file
  static async uploadFile(file: File, path: string): Promise<string> {
    // Validate file type
    if (!this.isValidImageType(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Upload avatar image
  static async uploadAvatar(file: File, userId: string): Promise<string> {
    return this.uploadFile(file, `avatars/${userId}`);
  }

  // Delete file
  static async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Delete multiple files
  static async deleteFiles(paths: string[]): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove(paths);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  // Get file URL from storage path
  static getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);

    return publicUrl;
  }

  // Extract storage path from public URL
  static getStoragePath(publicUrl: string): string {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === this.BUCKET_NAME);
    return pathParts.slice(bucketIndex + 1).join('/');
  }

  // Validate image file type
  private static isValidImageType(mimeType: string): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];
    return validTypes.includes(mimeType);
  }

  // Compress image before upload (optional utility)
  static async compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// Helper functions for easy importing
export const uploadItemImages = StorageService.uploadItemImages.bind(StorageService);
export const uploadAvatar = StorageService.uploadAvatar.bind(StorageService);
export const deleteFile = StorageService.deleteFile.bind(StorageService);
export const getPublicUrl = StorageService.getPublicUrl.bind(StorageService);

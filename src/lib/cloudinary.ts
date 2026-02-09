import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder name in Cloudinary (e.g., 'portfolio/projects')
 * @param publicId - Optional custom public ID
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'portfolio',
  publicId?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
      // Optimize images automatically
      quality: 'auto',
      fetch_format: 'auto',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      }
    );

    // Handle buffer or base64
    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      uploadStream.end(file);
    }
  });
}

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

/**
 * Get optimized Cloudinary URL
 * @param publicId - The public ID of the image
 * @param transformations - Cloudinary transformation options
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  }
): string {
  return cloudinary.url(publicId, transformations);
}

export default cloudinary;
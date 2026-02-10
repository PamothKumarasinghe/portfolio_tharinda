import { v2 as cloudinary } from 'cloudinary';

// Validate environment variables
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn('Warning: Cloudinary environment variables are not fully configured');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  timeout: 60000, // 60 seconds timeout
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
      timeout: 60000, // 60 seconds for individual upload
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // Set a timeout for the entire upload operation
    const timeoutId = setTimeout(() => {
      reject(new Error('Upload timeout - operation took longer than 60 seconds'));
    }, 60000);

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        clearTimeout(timeoutId);
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result as CloudinaryUploadResult);
        }
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

/**
 * Extract public ID from Cloudinary URL
 * @param url - Full Cloudinary URL
 * @returns Public ID or null if not a valid Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  try {
    // Handle Cloudinary URLs like:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.[a-z]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

export default cloudinary;
// GridFS helper for file storage in MongoDB
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

let bucket: GridFSBucket | null = null;

/**
 * Get or initialize GridFS bucket for CV files
 * Bucket name: "cvFiles"
 */
export async function getCVBucket(): Promise<GridFSBucket> {
  if (!bucket) {
    const client = await clientPromise;
    const db = client.db('portfolio');
    bucket = new GridFSBucket(db, { bucketName: 'cvFiles' });
  }
  return bucket;
}

/**
 * Upload file buffer to GridFS
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param contentType - MIME type
 * @returns ObjectId of uploaded file
 */
export async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<ObjectId> {
  const bucket = await getCVBucket();
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        contentType,
        uploadedAt: new Date(),
      },
    });

    uploadStream.on('finish', () => {
      resolve(uploadStream.id as ObjectId);
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.end(buffer);
  });
}

/**
 * Delete file from GridFS by ID
 * @param fileId - ObjectId of file to delete
 */
export async function deleteFromGridFS(fileId: ObjectId): Promise<void> {
  const bucket = await getCVBucket();
  await bucket.delete(fileId);
}

/**
 * Download file from GridFS as buffer
 * @param fileId - ObjectId of file to download
 * @returns File buffer
 */
export async function downloadFromGridFS(fileId: ObjectId): Promise<Buffer> {
  const bucket = await getCVBucket();
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    downloadStream.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Get file metadata from GridFS
 * @param fileId - ObjectId of file
 * @returns File metadata or null
 */
export async function getFileMetadata(fileId: ObjectId) {
  const bucket = await getCVBucket();
  const files = await bucket.find({ _id: fileId }).toArray();
  return files.length > 0 ? files[0] : null;
}

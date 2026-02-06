// API Route: Upload CV (Admin Only)
// POST /api/cv/upload - Accepts PDF file, replaces old CV if exists
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { uploadToGridFS, deleteFromGridFS } from '@/lib/gridfs';

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate PDF type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Connect to database
    const client = await clientPromise;
    const db = client.db('portfolio');
    const settingsCollection = db.collection('settings');

    // Check if CV already exists
    const existingCV = await settingsCollection.findOne({ type: 'cv' });

    // If old CV exists, delete it from GridFS
    if (existingCV && existingCV.fileId) {
      try {
        await deleteFromGridFS(new ObjectId(existingCV.fileId));
      } catch (error) {
        console.error('Error deleting old CV:', error);
        // Continue with upload even if delete fails
      }
    }

    // Upload new CV to GridFS
    const fileId = await uploadToGridFS(buffer, file.name, file.type);

    // Save or update CV reference in settings collection
    await settingsCollection.updateOne(
      { type: 'cv' },
      {
        $set: {
          type: 'cv',
          fileId: fileId,
          filename: file.name,
          uploadedAt: new Date(),
          size: buffer.length,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'CV uploaded successfully',
      data: {
        fileId: fileId.toString(),
        filename: file.name,
        size: buffer.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload CV' },
      { status: 500 }
    );
  }
}

// API Route: Download CV (Public)
// GET /api/cv/download - Streams PDF file from GridFS
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { downloadFromGridFS } from '@/lib/gridfs';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    const client = await clientPromise;
    const db = client.db('portfolio');
    const settingsCollection = db.collection('settings');

    // Find CV reference
    const cvSettings = await settingsCollection.findOne({ type: 'cv' });

    if (!cvSettings || !cvSettings.fileId) {
      return NextResponse.json(
        { success: false, error: 'CV not found' },
        { status: 404 }
      );
    }

    // Download file from GridFS
    const fileBuffer = await downloadFromGridFS(new ObjectId(cvSettings.fileId));
    const filename = cvSettings.filename || 'CV.pdf';

    // Return file with proper PDF headers
    // Convert Buffer to Uint8Array for NextResponse compatibility
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download CV' },
      { status: 500 }
    );
  }
}

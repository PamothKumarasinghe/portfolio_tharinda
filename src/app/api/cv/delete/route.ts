// API Route: Delete CV (Admin Only)
// DELETE /api/cv/delete - Removes CV from GridFS and settings
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { deleteFromGridFS } from '@/lib/gridfs';

export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    const client = await clientPromise;
    const db = client.db('portfolio');
    const settingsCollection = db.collection('settings');

    // Find CV reference
    const cvSettings = await settingsCollection.findOne({ type: 'cv' });

    if (!cvSettings || !cvSettings.fileId) {
      return NextResponse.json(
        { success: false, error: 'No CV found to delete' },
        { status: 404 }
      );
    }

    // Delete from GridFS
    try {
      await deleteFromGridFS(new ObjectId(cvSettings.fileId));
    } catch (error) {
      console.error('Error deleting from GridFS:', error);
      // Continue to remove settings even if GridFS delete fails
    }

    // Remove settings record
    await settingsCollection.deleteOne({ type: 'cv' });

    return NextResponse.json({
      success: true,
      message: 'CV deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
}

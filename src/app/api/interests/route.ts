import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Interest } from '@/lib/types';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';

// GET all interests
export async function GET(request: NextRequest) {
  try {
    // Rate limit public reads
    const rateLimit = checkRateLimit(request, RATE_LIMITS.publicRead);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const interests = await db.collection<Interest>('interests')
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: interests });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

// POST create new interest
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authCheck = await requireAuth(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: 401 }
      );
    }

    // Rate limit
    const rateLimit = checkRateLimit(request, RATE_LIMITS.api);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const newInterest = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('interests').insertOne(newInterest);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newInterest }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create interest' },
      { status: 500 }
    );
  }
}

// PUT update an interest
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const authCheck = await requireAuth(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: 401 }
      );
    }

    // Rate limit
    const rateLimit = checkRateLimit(request, RATE_LIMITS.api);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const { _id, ...data } = await request.json();
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Interest ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const { ObjectId } = require('mongodb');
    const result = await db.collection('interests').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...data, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Interest not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update interest' },
      { status: 500 }
    );
  }
}

// DELETE an interest
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const authCheck = await requireAuth(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: 401 }
      );
    }

    // Rate limit
    const rateLimit = checkRateLimit(request, RATE_LIMITS.api);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Interest ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const { ObjectId } = require('mongodb');
    const result = await db.collection('interests').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Interest not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete interest' },
      { status: 500 }
    );
  }
}

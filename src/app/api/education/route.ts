import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Education } from '@/lib/types';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { validate, educationSchema } from '@/lib/validation';

// GET all education records
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
    
    const education = await db.collection<Education>('education')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education records' },
      { status: 500 }
    );
  }
}

// POST create new education record
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

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const body = await request.json();
    const { _id, ...dataToValidate } = body;
    
    // Validate input
    const validation = validate(educationSchema, dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors?.issues },
        { status: 400 }
      );
    }

    const educationData = validation.data;
    
    const newEducation = {
      ...educationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('education').insertOne(newEducation);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newEducation }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create education record' },
      { status: 500 }
    );
  }
}

// PUT update education record
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

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const body = await request.json();
    const { _id, ...dataToValidate } = body;
    
    // Validate input
    const validation = validate(educationSchema, dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors?.issues },
        { status: 400 }
      );
    }

    const updateData = validation.data;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Education ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('education').updateOne(
      { _id: new (require('mongodb').ObjectId)(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Education record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update education record' },
      { status: 500 }
    );
  }
}

// DELETE education record
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

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Education ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('education').deleteOne({
      _id: new (require('mongodb').ObjectId)(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Education record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete education record' },
      { status: 500 }
    );
  }
}

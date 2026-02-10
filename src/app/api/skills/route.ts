import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SkillCategory } from '@/lib/types';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { validate, skillSchema, skillCategorySchema } from '@/lib/validation';

// GET all skill categories
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
    
    const skills = await db.collection<SkillCategory>('skills')
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create new skill category
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
    const validation = validate(skillCategorySchema, dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors?.issues },
        { status: 400 }
      );
    }

    const bodyWithoutId = validation.data;
    
    const newSkillCategory = {
      ...bodyWithoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('skills').insertOne(newSkillCategory);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newSkillCategory }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create skill category' },
      { status: 500 }
    );
  }
}

// PUT update skill category
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
    const validation = validate(skillCategorySchema, dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors?.issues },
        { status: 400 }
      );
    }

    const updateData = validation.data;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Skill category ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('skills').updateOne(
      { _id: new (require('mongodb').ObjectId)(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update skill category' },
      { status: 500 }
    );
  }
}

// DELETE skill category
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
        { success: false, error: 'Skill category ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('skills').deleteOne({
      _id: new (require('mongodb').ObjectId)(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Skill category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill category' },
      { status: 500 }
    );
  }
}

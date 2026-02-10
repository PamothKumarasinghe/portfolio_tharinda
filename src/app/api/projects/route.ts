import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Project } from '@/lib/types';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { validate, projectSchema } from '@/lib/validation';

// GET all projects or filtered by limit (PUBLIC)
export async function GET(request: NextRequest) {
  try {
    // Rate limit public endpoints
    const rateLimit = checkRateLimit(request, RATE_LIMITS.publicRead);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    
    let query: any = {};
    if (featured === 'true') {
      query.featured = true;
    }
    
    let projects;
    if (limit) {
      projects = await db.collection<Project>('projects')
        .find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .toArray();
    } else {
      projects = await db.collection<Project>('projects')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
    }
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST create new project (PROTECTED)
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
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

    const body = await request.json();
    
    // Validate input
    const validation = validate(projectSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          details: validation.errors?.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const newProject = {
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('projects').insertOne(newProject);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newProject }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT update project (PROTECTED)
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
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

    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validate(projectSchema, updateData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          details: validation.errors?.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const result = await db.collection('projects').updateOne(
      { _id: new (require('mongodb').ObjectId)(_id) },
      { $set: { ...validation.data, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project (PROTECTED)
export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
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

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    const result = await db.collection('projects').deleteOne({
      _id: new (require('mongodb').ObjectId)(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

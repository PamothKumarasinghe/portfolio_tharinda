import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';
import { validate, loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(request, RATE_LIMITS.login);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMITS.login.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetAt)
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validation = validate(loginSchema, body);
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

    const { username, password } = validation.data!;
    
    const client = await clientPromise;
    const db = client.db('portfolio');
    
    // Find admin user
    const admin = await db.collection('admins').findOne({ username });
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = await generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      email: admin.email
    });
    
    // Return success with JWT token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

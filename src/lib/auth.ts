import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface TokenPayload extends JWTPayload {
  userId: string;
  username: string;
  email: string;
}

/**
 * Generate JWT token for authenticated user
 */
export async function generateToken(payload: Omit<TokenPayload, keyof JWTPayload>): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract and verify token from request
 */
export async function getTokenFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<{
  authorized: boolean;
  user?: TokenPayload;
  error?: string;
}> {
  const user = await getTokenFromRequest(request);
  
  if (!user) {
    return {
      authorized: false,
      error: 'Unauthorized - Invalid or missing token'
    };
  }
  
  return {
    authorized: true,
    user
  };
}

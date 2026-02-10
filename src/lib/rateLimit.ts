import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetAt < now) {
      delete rateLimitStore[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  /**
   * Custom message when rate limit is exceeded
   */
  message?: string;
}

/**
 * Rate limiting middleware
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig = { maxRequests: 10, windowSeconds: 60 }
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  error?: string;
} {
  // Get client identifier (IP address)
  const identifier = getClientIdentifier(request);
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  // Initialize or get existing rate limit data
  if (!rateLimitStore[identifier] || rateLimitStore[identifier].resetAt < now) {
    rateLimitStore[identifier] = {
      count: 1,
      resetAt: now + windowMs
    };
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: rateLimitStore[identifier].resetAt
    };
  }
  
  // Increment count
  rateLimitStore[identifier].count++;
  
  const remaining = Math.max(0, config.maxRequests - rateLimitStore[identifier].count);
  const allowed = rateLimitStore[identifier].count <= config.maxRequests;
  
  if (!allowed) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: rateLimitStore[identifier].resetAt,
      error: config.message || 'Too many requests. Please try again later.'
    };
  }
  
  return {
    allowed: true,
    remaining,
    resetAt: rateLimitStore[identifier].resetAt
  };
}

/**
 * Get client identifier from request (IP address or user agent fallback)
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for deployments behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to user agent as identifier
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Strict limit for login attempts
  login: {
    maxRequests: 5,
    windowSeconds: 300, // 5 minutes
    message: 'Too many login attempts. Please try again in 5 minutes.'
  },
  // Moderate limit for contact form
  contact: {
    maxRequests: 3,
    windowSeconds: 3600, // 1 hour
    message: 'Too many contact form submissions. Please try again later.'
  },
  // Moderate limit for file uploads
  upload: {
    maxRequests: 10,
    windowSeconds: 3600, // 1 hour
    message: 'Too many upload requests. Please try again later.'
  },
  // Generous limit for general API calls
  api: {
    maxRequests: 100,
    windowSeconds: 60, // 1 minute
    message: 'Too many requests. Please slow down.'
  },
  // Very generous limit for public read endpoints
  publicRead: {
    maxRequests: 200,
    windowSeconds: 60, // 1 minute
    message: 'Too many requests. Please slow down.'
  }
};

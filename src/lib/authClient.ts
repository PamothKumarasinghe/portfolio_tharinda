/**
 * Client-side authentication utilities
 * Handles JWT token storage and authenticated API requests
 */

/**
 * Get the JWT token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Logout user by removing token
 */
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/admin/login';
}

/**
 * Make an authenticated API request
 * Automatically includes JWT token in Authorization header
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  
  if (!token) {
    // Redirect to login if no token
    logout();
    throw new Error('Not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, logout and redirect
  if (response.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  return response;
}

/**
 * Helper for authenticated JSON requests
 */
export async function authenticatedFetchJSON<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response.json();
}

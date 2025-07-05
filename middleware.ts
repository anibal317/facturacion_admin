import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed origins
const allowedOrigins = [
  'https://facturacionale.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://facturacion-admin.onrender.com',
  'https://facturacion-admin.vercel.app/api',
  'https://facturacion-admin.vercel.app/*',
  '*',
  'https://bolivarsoftware.com'
];

// Helper function to check if origin is allowed
function isAllowedOrigin(origin: string | null): boolean {
  return origin !== null && allowedOrigins.includes(origin);
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const origin = req.headers.get('origin');

  // CORS configuration
  if (origin && isAllowedOrigin(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  // Define public paths that don't require authentication
  const publicPaths = ['/api/login', '/api/register', '/login', '/register', '/'];
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  // Check for JWT token
  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '');

  // Redirect to login if accessing a protected route without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // For API routes, return 401 instead of redirecting
  if (req.nextUrl.pathname.startsWith('/api/') && !isPublicPath && !token) {
    return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return res;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};


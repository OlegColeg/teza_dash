import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'stadion_secret_key_2026');

const PUBLIC_PATHS = ['/login', '/register', '/_next', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/image', '/favicon.ico'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Lasă drumul liber pentru resurse publice și API-uri de auth
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Lasă API-urile interne să-și gestioneze propria autentificare
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verifică cookie-ul HTTP-only setat la login
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Fără token → redirecționează la login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid sau expirat
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    // Șterge cookie-ul invalid
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|image/).*)'],
};

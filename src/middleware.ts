import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'querymasters';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const currentTime = Math.floor(Date.now() / 1000);

    if (
      typeof decoded === 'object' &&
      'exp' in decoded &&
      decoded.exp !== undefined &&
      decoded.exp < currentTime
    ) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
    return NextResponse.next();
  } catch (err) {
    console.log('invalid token:', err )
    return NextResponse.redirect(new URL('/', request.nextUrl.origin));
  }
}

export const config = {
  matcher: ['/history', '/variables','/rest-client/:path*'],
};

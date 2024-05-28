import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';

export async function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const role = cookies.rol as string;

  const protectedRoutes = {
    USUARIO: '/InicioUsuario',
    PROPIETARIO: '/InicioPropietario',
    ADMIN: '/InicioAdmin',
    BANEADO: '/InicioBaneado',
  };

  const userRoles: (keyof typeof protectedRoutes)[] = ['USUARIO', 'PROPIETARIO', 'ADMIN', 'BANEADO'];

  if (!role || !userRoles.includes(role as keyof typeof protectedRoutes)) {
    return NextResponse.redirect(new URL('/Adonde', request.url));
  }

  const userRoute = protectedRoutes[role as keyof typeof protectedRoutes];

  if (request.nextUrl.pathname.startsWith(userRoute)) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL(userRoute, request.url));
  }
}

export const config = {
  matcher: ['/InicioUsuario/:path*', '/InicioPropietario/:path*', '/InicioAdmin/:path*', '/InicioBaneado/:path*'],
};

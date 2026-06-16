// Protege todo /admin: sem cookie de sessão do Supabase, redireciona para
// /admin/login. A verificação dura do token acontece nas rotas de API
// (lib/adminAuth.ts); aqui é o portão de navegação.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const temSessao = req.cookies
    .getAll()
    .some(
      (c) =>
        c.name.startsWith("sb-") &&
        c.name.endsWith("-auth-token") &&
        c.value.length > 0,
    );

  if (!temSessao) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

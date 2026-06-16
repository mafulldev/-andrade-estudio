// Autenticação das rotas de API do admin: o cliente envia o access token
// da sessão (anon key + magic link) e o servidor o verifica com a service
// role, exigindo que o e-mail seja exatamente o ADMIN_EMAIL.

import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export type ResultadoAuth =
  | { ok: true }
  | { ok: false; status: number; mensagem: string };

export async function autenticarAdmin(req: NextRequest): Promise<ResultadoAuth> {
  const sb = supabaseAdmin();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!sb || !adminEmail) {
    return { ok: false, status: 503, mensagem: "Admin indisponível sem configuração." };
  }

  const cabecalho = req.headers.get("authorization") ?? "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;
  if (!token) return { ok: false, status: 401, mensagem: "Sessão ausente." };

  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user?.email) {
    return { ok: false, status: 401, mensagem: "Sessão inválida." };
  }
  if (data.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { ok: false, status: 403, mensagem: "Acesso negado." };
  }
  return { ok: true };
}

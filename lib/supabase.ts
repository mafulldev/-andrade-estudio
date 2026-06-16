// Clientes do Supabase.
// O cliente admin usa a service role e SÓ existe no servidor: jamais
// importe este módulo em client components. Sem env, retorna null e o
// recurso degrada com elegância.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null | undefined;

export function supabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    console.log("[supabase] envs ausentes: banco desligado nesta execução");
    admin = null;
    return admin;
  }
  admin = createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

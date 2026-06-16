// Cliente do Supabase para o browser (admin), com a anon key e sessão
// persistida em COOKIE: o projeto não usa localStorage nem sessionStorage.
// O cookie de sessão também é o sinal que o middleware lê para proteger /admin.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const armazenamentoCookie = {
  getItem(chave: string): string | null {
    const m = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${chave.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
    );
    return m ? decodeURIComponent(m[1]) : null;
  },
  setItem(chave: string, valor: string) {
    const seguro = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${chave}=${encodeURIComponent(valor)}; path=/; max-age=604800; samesite=lax${seguro}`;
  },
  removeItem(chave: string) {
    document.cookie = `${chave}=; path=/; max-age=0; samesite=lax`;
  },
};

let cliente: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (!cliente) {
    cliente = createClient(url, anon, {
      auth: {
        storage: armazenamentoCookie,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "implicit",
      },
    });
  }
  return cliente;
}

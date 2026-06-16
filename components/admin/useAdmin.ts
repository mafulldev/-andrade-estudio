"use client";

// Sessão do admin no cliente: obtém o access token para as rotas de API,
// redireciona para o login quando não há sessão e expõe o sair.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export function useAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setCarregando(false);
      router.replace("/admin/login");
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      const t = data.session?.access_token ?? null;
      setToken(t);
      setCarregando(false);
      if (!t) router.replace("/admin/login");
    });
    const { data: assinatura } = sb.auth.onAuthStateChange((_evento, sessao) => {
      setToken(sessao?.access_token ?? null);
    });
    return () => assinatura.subscription.unsubscribe();
  }, [router]);

  const sair = useCallback(async () => {
    await supabaseBrowser()?.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  const autorizado = useCallback(
    (extras?: HeadersInit): HeadersInit => ({
      ...extras,
      authorization: `Bearer ${token ?? ""}`,
    }),
    [token],
  );

  return { token, carregando, sair, autorizado };
}

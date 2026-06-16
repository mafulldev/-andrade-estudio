"use client";

// Login do admin por magic link. Cadastro desabilitado: shouldCreateUser
// é false e o registro também fica fechado no painel do Supabase (README).

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToggleTema from "@/components/ToggleTema";
import { CampoLinha } from "@/components/Campos";
import { BotaoLinha } from "@/components/Botoes";
import { mostrarToast } from "@/components/Toast";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import s from "@/app/admin/admin.module.css";

export default function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [semConfig, setSemConfig] = useState(false);
  const router = useRouter();

  // o magic link redireciona para cá: com sessão detectada, entra no admin
  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setSemConfig(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
    const { data: assinatura } = sb.auth.onAuthStateChange((_e, sessao) => {
      if (sessao) router.replace("/admin");
    });
    return () => assinatura.subscription.unsubscribe();
  }, [router]);

  const enviar = async () => {
    const sb = supabaseBrowser();
    if (!sb || enviando) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      mostrarToast("Confira o e-mail informado.");
      return;
    }
    setEnviando(true);
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin/login`,
      },
    });
    setEnviando(false);
    if (error) {
      mostrarToast("Não foi possível enviar o link. Confira o e-mail do admin.");
      return;
    }
    setEnviado(true);
  };

  return (
    <div className={s.login}>
      <div className={s.loginCaixa}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="monograma" aria-label="ANDRADE, voltar ao site">
            A
          </Link>
          <ToggleTema />
        </div>
        <div>
          <span className="label">Admin</span>
          <h1 style={{ fontSize: "1.9rem", marginTop: 8 }}>O CRM do estúdio.</h1>
        </div>

        {semConfig ? (
          <p className="mudo">
            Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
            para habilitar o acesso.
          </p>
        ) : enviado ? (
          <p>
            Link de acesso enviado. Abra o e-mail e clique no link para entrar.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            style={{ display: "grid", gap: 22 }}
          >
            <CampoLinha
              rotulo="E-mail do admin"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <BotaoLinha tipo="submit">
              {enviando ? "Enviando" : "Receber link de acesso"}
            </BotaoLinha>
          </form>
        )}
      </div>
    </div>
  );
}

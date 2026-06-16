"use client";

// Topo do admin: navegação, toggle de tema e sair.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ToggleTema from "@/components/ToggleTema";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import s from "@/app/admin/admin.module.css";

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  const sair = async () => {
    await supabaseBrowser()?.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <header className={s.topo}>
      <div className={s.topoEsq}>
        <Link href="/" className="cab-wordmark" aria-label="ANDRADE, voltar ao site">
          A N D R A D E
        </Link>
        <nav className={s.topoNav} aria-label="Admin">
          <Link href="/admin" data-ativo={path === "/admin"}>
            Dashboard
          </Link>
          <Link href="/admin/leads" data-ativo={path === "/admin/leads"}>
            Leads
          </Link>
        </nav>
      </div>
      <div className="cab-acoes">
        <ToggleTema />
        <button type="button" className={s.sair} onClick={sair}>
          Sair
        </button>
      </div>
    </header>
  );
}

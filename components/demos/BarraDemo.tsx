"use client";

// Barra fixa de toda demo: identifica o modelo como demonstração do
// estúdio, registra demo_view na montagem e demo_quero_click antes de
// abrir o WhatsApp com o template que nomeia o modelo.

import Link from "next/link";
import { useEffect } from "react";
import { trackEvento } from "@/lib/eventos";
import s from "./barra.module.css";

const WHATSAPP_NUMERO = "5519971460099";

export default function BarraDemo({ marca }: { marca: string }) {
  useEffect(() => {
    trackEvento("demo_view", { marca });
  }, [marca]);

  const mensagem = `Olá, Matheus. Vi o modelo ${marca} e quero um site assim para o meu negócio.`;
  const linkQuero = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

  return (
    <div className={s.barra} role="complementary" aria-label="Barra de demonstração">
      <span className={s.rotulo}>
        Modelo de demonstração · <strong>ANDRADE</strong> Estúdio
      </span>
      <span className={s.acoes}>
        <Link href="/" className={s.acao}>
          Voltar
        </Link>
        <a
          href={linkQuero}
          className={`${s.acao} ${s.quero}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvento("demo_quero_click", { marca })}
        >
          Quero este site
        </a>
      </span>
    </div>
  );
}

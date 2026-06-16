"use client";

// Header fixo do estúdio: wordmark, toggle de tema e MENU magnético.

import Link from "next/link";
import { useState, type Ref } from "react";
import ToggleTema from "@/components/ToggleTema";
import MenuOverlay from "@/components/MenuOverlay";
import { useMagnetico } from "@/components/Botoes";

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const magnetico = useMagnetico();

  return (
    <>
      <header className="cab">
        <Link href="/" className="cab-wordmark" aria-label="ANDRADE, voltar ao início">
          A N D R A D E
        </Link>
        <div className="cab-acoes">
          <ToggleTema />
          <button
            ref={magnetico as unknown as Ref<HTMLButtonElement>}
            type="button"
            className="cab-menu"
            onClick={() => setAberto(true)}
            aria-haspopup="dialog"
            aria-expanded={aberto}
          >
            <span className="cab-menu-tracos" aria-hidden="true">
              <span />
              <span />
            </span>
            MENU
          </button>
        </div>
      </header>
      <MenuOverlay aberto={aberto} aoFechar={() => setAberto(false)} />
    </>
  );
}

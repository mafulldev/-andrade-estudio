"use client";

// Toggle circular hairline com transição de revelação circular
// (View Transitions a partir do ponto do clique, com fallback de troca
// direta) e persistência em cookie de sessão.

import { useRef } from "react";
import { m } from "motion/react";
import {
  aplicarTemaNoDocumento,
  gravarTemaCliente,
  type Tema,
} from "@/lib/tema";
import { IcoTema } from "@/components/Icones";

type DocComVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ToggleTema() {
  const ref = useRef<HTMLButtonElement>(null);

  const alternar = () => {
    const atual: Tema =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const proximo: Tema = atual === "light" ? "dark" : "light";

    const aplicar = () => {
      aplicarTemaNoDocumento(proximo);
      gravarTemaCliente(proximo);
    };

    const doc = document as DocComVT;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduzido) {
      aplicar();
      return;
    }

    const r = ref.current?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const cy = r ? r.top + r.height / 2 : window.innerHeight / 2;
    const raio = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    const transicao = doc.startViewTransition(aplicar);
    transicao.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${raio}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };

  return (
    <m.button
      ref={ref}
      type="button"
      className="toggle-tema"
      onClick={alternar}
      aria-label="Alternar tema claro e escuro"
      data-cursor="TEMA"
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", visualDuration: 0.45, bounce: 0 }}
    >
      <IcoTema size={16} />
    </m.button>
  );
}

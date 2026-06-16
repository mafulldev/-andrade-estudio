"use client";

// Transição de rota: cada navegação entra mascarada (opacity + y) e avisa
// o VeuRotas ("rota:entrou") para o véu de saída abrir em sincronia.
// Neutra para não vazar identidade nas demos. O transform é limpo ao
// final para não criar containing block sobre os elementos fixos
// (fundo da home, header). Reduced-motion: sem animação.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rota:entrou"));
  }, []);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "andrade",
          clearProps: "all",
        },
      );
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}

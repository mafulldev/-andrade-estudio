"use client";

// Véu de transição de rota. O App Router não tem exit animation nativa,
// então: interceptamos cliques em links internos (filtros estritos: botão
// esquerdo, sem modificadores, sem target/download, mesma origem, rota
// diferente), fechamos o véu por clip-path ("cortina"), navegamos, e o
// template.tsx avisa a chegada ("rota:entrou") para o véu abrir. Voltar e
// avançar do navegador NUNCA mostram véu; timeout de 1.2s é o seguro;
// reduced-motion pula tudo.

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "@/components/LenisProvider";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export default function VeuRotas() {
  const ref = useRef<HTMLDivElement>(null);
  const fechadoRef = useRef(false);
  const router = useRouter();
  const { obter } = useLenis();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const abrir = () => {
      if (!fechadoRef.current) return;
      fechadoRef.current = false;
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "cortina",
        onComplete: () => gsap.set(el, { clipPath: "inset(100% 0 0 0)" }),
      });
    };

    const aoClicar = (e: MouseEvent) => {
      if (fechadoRef.current) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const alvo = e.target instanceof Element ? e.target.closest("a") : null;
      if (!alvo) return;
      if (alvo.target || alvo.hasAttribute("download")) return;
      const href = alvo.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const destino = new URL(href, window.location.origin);
      if (destino.pathname === window.location.pathname) return;
      // demos têm identidade própria: entram sem o véu do estúdio
      if (destino.pathname.startsWith("/demos")) return;

      e.preventDefault();
      fechadoRef.current = true;
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.45,
          ease: "cortina",
          onComplete: () => {
            // o salto para o topo acontece ATRÁS do véu fechado
            obter()?.scrollTo(0, { immediate: true, force: true });
            router.push(destino.pathname + destino.search + destino.hash);
          },
        },
      );
      // seguro: se a rota não chegar, o véu abre sozinho
      window.setTimeout(abrir, 1600);
    };

    const aoEntrarRota = () => abrir();
    const aoVoltar = () => {
      // back/forward nunca ficam presos atrás do véu
      fechadoRef.current = false;
      gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
    };

    document.addEventListener("click", aoClicar);
    window.addEventListener("rota:entrou", aoEntrarRota);
    window.addEventListener("popstate", aoVoltar);
    return () => {
      document.removeEventListener("click", aoClicar);
      window.removeEventListener("rota:entrou", aoEntrarRota);
      window.removeEventListener("popstate", aoVoltar);
    };
  }, [router, obter]);

  return (
    <div className="veu-rotas" ref={ref} aria-hidden="true">
      <span className="cab-wordmark">A N D R A D E</span>
    </div>
  );
}

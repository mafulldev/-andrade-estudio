"use client";

// Cursor custom de desktop: ponto com lerp rápido e anel hairline dourado
// com atraso de veludo (lerp lento). Sobre [data-cursor], o ponto vira a
// pílula com o estado (VER, ABRIR, ARRASTE, TEMA, INICIAR) e o anel escala.
// Puramente visual (aria-hidden); em touch não é montado.

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const anelRef = useRef<HTMLDivElement>(null);
  const rotuloRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    const anel = anelRef.current;
    const rotulo = rotuloRef.current;
    if (!el || !anel || !rotulo) return;

    el.style.display = "block";
    anel.style.display = "block";
    gsap.set([el, anel], { x: -100, y: -100 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "andrade" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "andrade" });
    const xAnel = gsap.quickTo(anel, "x", { duration: 0.7, ease: "andrade" });
    const yAnel = gsap.quickTo(anel, "y", { duration: 0.7, ease: "andrade" });

    const aoMover = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xAnel(e.clientX);
      yAnel(e.clientY);
      const alvo =
        e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      const estado = alvo?.getAttribute("data-cursor") ?? "";
      if (estado) {
        rotulo.textContent = estado;
        el.classList.add("ativo");
        anel.classList.add("ativo");
      } else {
        el.classList.remove("ativo");
        anel.classList.remove("ativo");
      }
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", aoMover);
    };
  }, []);

  return (
    <>
      {/* o nó externo pertence ao GSAP (x/y); o interno, ao CSS (escala) */}
      <div className="cursor-anel" ref={anelRef} aria-hidden="true">
        <span className="cursor-anel-inner" />
      </div>
      <div className="cursor" ref={ref} aria-hidden="true">
        <span className="cursor-ponto">
          <span className="cursor-rotulo" ref={rotuloRef} />
        </span>
      </div>
    </>
  );
}

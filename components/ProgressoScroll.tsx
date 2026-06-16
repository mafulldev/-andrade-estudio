"use client";

// Hairline de progresso de leitura: 1px de ouro no topo, escalando com o
// scroll da página por scrub. Não aparece nas demos (identidade própria)
// nem no admin (densidade de ferramenta), e some em reduced-motion.

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProgressoScroll() {
  const ref = useRef<HTMLSpanElement>(null);
  const path = usePathname();
  const oculto =
    path.startsWith("/demos") ||
    path.startsWith("/admin") ||
    path.startsWith("/estimativa");

  useGSAP(
    () => {
      if (oculto || !ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { dependencies: [oculto, path] },
  );

  if (oculto) return null;

  return (
    <div className="progresso-leitura" aria-hidden="true">
      <span ref={ref} />
    </div>
  );
}

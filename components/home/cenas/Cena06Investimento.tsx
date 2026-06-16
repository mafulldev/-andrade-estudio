"use client";

// CAP 06 · INVESTIMENTO + FAQ. Fluxo: as três linhas de plano entram em
// stagger com os valores rolando como odômetro; o FAQ revela item a item.
// Hover dos planos é CSS puro (border-color), zero conflito com GSAP.
// Reduced: tudo estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registrarMotion } from "@/lib/motion/registro";
import { odometro } from "@/lib/motion/texto";

registrarMotion();

export default function Cena06Investimento({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const limpadores: (() => void)[] = [];
        document.fonts.ready.then(() => {
          ctx.add(() => {
            q("[data-plano]").forEach((plano, i) => {
              gsap.fromTo(
                plano,
                { autoAlpha: 0, y: 28 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: i * 0.08,
                  scrollTrigger: { trigger: plano, start: "top 85%", once: true },
                },
              );
              const valor = plano.querySelector("[data-plano-valor]");
              if (valor) {
                odometro(valor, { trigger: plano, start: "top 85%", once: true }, { delay: 0.2 + i * 0.08 });
                // micro: o valor rola de novo no hover, com guarda anti-spam
                if (window.matchMedia("(pointer: fine)").matches) {
                  const rolarDeNovo = () => {
                    if (valor.getAttribute("data-rolando") === "1") return;
                    valor.setAttribute("data-rolando", "1");
                    odometro(valor);
                    window.setTimeout(() => valor.removeAttribute("data-rolando"), 1400);
                  };
                  plano.addEventListener("pointerenter", rolarDeNovo);
                  limpadores.push(() => plano.removeEventListener("pointerenter", rolarDeNovo));
                }
              }
            });

            // garantias: células em stagger e o selo autoral se desenhando
            q("[data-garantia]").forEach((celula, i) => {
              gsap.fromTo(
                celula,
                { autoAlpha: 0, y: 18 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 4) * 0.06,
                  scrollTrigger: { trigger: celula, start: "top 90%", once: true },
                },
              );
            });
            const selo = q("[data-garantias] [data-picto]")[0];
            if (selo) {
              gsap.fromTo(
                selo.querySelectorAll("path, circle"),
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 1.3,
                  ease: "andrade",
                  stagger: 0.15,
                  scrollTrigger: { trigger: selo, start: "top 85%", once: true },
                },
              );
            }

            gsap.utils.toArray<HTMLElement>(q(".acc-item")).forEach((item, i) => {
              gsap.fromTo(
                item,
                { autoAlpha: 0, y: 28 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 5) * 0.05,
                  scrollTrigger: { trigger: item, start: "top 90%", once: true },
                },
              );
            });
          });
        });

        return () => limpadores.forEach((f) => f());
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-investimento" className={className} ref={ref}>
      {children}
    </section>
  );
}

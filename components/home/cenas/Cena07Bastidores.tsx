"use client";

// CAP 07 (eyebrow 06) · BASTIDORES. Sem pin: fluxo editorial. Os itens da
// lista técnica revelam em stagger, uma hairline vertical se DESENHA ao
// lado da ficha (eco do cap-02), os valores da ficha rolam como odômetro
// e os rótulos decodificam. Reduced: estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registrarMotion } from "@/lib/motion/registro";
import { odometro, scramble } from "@/lib/motion/texto";

registrarMotion();

export default function Cena07Bastidores({
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
        document.fonts.ready.then(() => {
          ctx.add(() => {
            q("[data-bastidores-item]").forEach((item, i) => {
              gsap.fromTo(
                item,
                { autoAlpha: 0, y: 28 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 6) * 0.07,
                  scrollTrigger: { trigger: item, start: "top 88%", once: true },
                },
              );
            });

            const linha = q("[data-ficha-svg] line")[0];
            if (linha) {
              gsap.fromTo(
                linha,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  ease: "none",
                  scrollTrigger: {
                    trigger: q("[data-ficha]")[0],
                    start: "top 80%",
                    end: "bottom 60%",
                    scrub: 0.8,
                  },
                },
              );
            }

            q("[data-ficha-linha]").forEach((linhaFicha, i) => {
              gsap.fromTo(
                linhaFicha,
                { autoAlpha: 0, y: 18 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 6) * 0.06,
                  scrollTrigger: { trigger: linhaFicha, start: "top 90%", once: true },
                },
              );
              const valor = linhaFicha.querySelector("[data-ficha-valor]");
              if (valor) {
                odometro(valor, { trigger: linhaFicha, start: "top 90%", once: true }, { delay: 0.2 });
              }
              const rotulo = linhaFicha.querySelector("dt");
              if (rotulo) {
                scramble(rotulo, { trigger: linhaFicha, start: "top 90%", once: true }, { delay: 0.1, duration: 0.5 });
              }
            });
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-bastidores" className={className} ref={ref}>
      {children}
    </section>
  );
}

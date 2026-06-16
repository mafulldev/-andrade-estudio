"use client";

// PROJETO REAL (NeuroCode AI), o fecho do capítulo Projetos. Sem pin:
// o nome entra por linhas mascaradas, a rede neural se DESENHA (DrawSVG
// nas arestas, nós na sequência) com o nó âmbar acendendo por último,
// e fatos + CTA revelam em stagger. Reduced: estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export default function CenaProjetoReal({
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
      const splits: SplitText[] = [];

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        document.fonts.ready.then(() => {
          ctx.add(() => {
            const nome = q("[data-projeto-nome]")[0];
            if (nome) {
              const split = new SplitText(nome, { type: "lines", mask: "lines" });
              splits.push(split);
              gsap.fromTo(
                split.lines,
                { yPercent: 112 },
                {
                  yPercent: 0,
                  duration: 1.3,
                  ease: "andrade",
                  stagger: 0.1,
                  scrollTrigger: { trigger: nome, start: "top 80%", once: true },
                },
              );
            }

            // a rede se desenha: arestas primeiro, nós em sequência,
            // o acento âmbar acende por último
            const arte = q("[data-projeto-arte]")[0];
            if (arte) {
              const tl = gsap.timeline({
                scrollTrigger: { trigger: arte, start: "top 80%", once: true },
              });
              tl.fromTo(
                arte.querySelectorAll("path"),
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.1, ease: "andrade", stagger: 0.06 },
                0,
              )
                .fromTo(
                  arte.querySelectorAll("circle:not([data-neuro-acento])"),
                  { drawSVG: "0%" },
                  { drawSVG: "100%", duration: 0.5, ease: "andrade", stagger: 0.05 },
                  0.35,
                )
                .fromTo(
                  arte.querySelectorAll("[data-neuro-acento]"),
                  { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" },
                  { autoAlpha: 1, scale: 1, duration: 0.85, ease: "andrade" },
                  1.15,
                );
            }

            q("[data-projeto-fato], [data-projeto-cta]").forEach((alvo, i) => {
              gsap.fromTo(
                alvo,
                { autoAlpha: 0, y: 28 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 3) * 0.07,
                  scrollTrigger: { trigger: alvo, start: "top 88%", once: true },
                },
              );
            });
          });
        });
      });

      return () => {
        splits.forEach((sp) => sp.revert());
        splits.length = 0;
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <section id="projeto-real" className={className} ref={ref}>
      {children}
    </section>
  );
}

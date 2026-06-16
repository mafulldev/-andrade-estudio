"use client";

// CODA · CHAMADA FINAL + FOOTER. O título monta por linha mascarada, o
// anel se desenha em volta do CTA circular, o footer revela em blocos e o
// wordmark final sobe do chão da página. Reduced: estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export default function CenaCoda({
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
            const titulo = q("[data-coda-titulo]")[0];
            if (titulo) {
              const split = new SplitText(titulo, { type: "lines", mask: "lines" });
              splits.push(split);
              gsap.fromTo(
                split.lines,
                { yPercent: 112 },
                {
                  yPercent: 0,
                  duration: 1.3,
                  ease: "andrade",
                  stagger: 0.1,
                  scrollTrigger: { trigger: titulo, start: "top 72%", once: true },
                },
              );
            }

            const anel = q("[data-coda-anel] circle")[0];
            if (anel) {
              gsap.fromTo(
                anel,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 1.1,
                  ease: "andrade",
                  scrollTrigger: { trigger: anel, start: "top 78%", once: true },
                },
              );
            }

            // o único âmbar em movimento do site: um ponto orbitando o anel
            // em 40s, pausado fora de vista (MotionPath + toggleActions)
            const orbita = q("[data-coda-orbita]")[0];
            const dot = q("[data-coda-dot]")[0];
            if (orbita && dot) {
              gsap.to(dot, { opacity: 0.9, duration: 0.85, ease: "andrade", delay: 1 });
              gsap.to(dot, {
                motionPath: {
                  path: orbita as unknown as SVGPathElement,
                  align: orbita as unknown as SVGPathElement,
                  alignOrigin: [0.5, 0.5],
                },
                duration: 40,
                repeat: -1,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  toggleActions: "play pause resume pause",
                },
              });
            }

            q("[data-coda-acao], [data-rodape-bloco]").forEach((bloco, i) => {
              gsap.fromTo(
                bloco,
                { autoAlpha: 0, y: 28 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "andrade",
                  delay: (i % 4) * 0.08,
                  scrollTrigger: { trigger: bloco, start: "top 88%", once: true },
                },
              );
            });

            const wordmark = q("[data-rodape-wordmark] span")[0];
            if (wordmark) {
              gsap.fromTo(
                wordmark,
                { yPercent: 60 },
                {
                  yPercent: 0,
                  duration: 1.4,
                  ease: "andrade",
                  scrollTrigger: { trigger: wordmark.parentElement, start: "top 95%", once: true },
                },
              );
            }
          });
        });

        return () => {
          splits.forEach((sp) => sp.revert());
          splits.length = 0;
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-final" className={className} ref={ref}>
      {children}
    </section>
  );
}

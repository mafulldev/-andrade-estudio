"use client";

// CAP 04 · O PORTAL DO DIAGNÓSTICO + PROCESSO. Palco pinned curto (+=150%):
// o anel SVG se DESENHA em volta do botão circular (DrawSVG) e as seis
// perguntas chegam como lista hairline decodificando. Depois, em fluxo: a
// linha do processo se desenha com o scroll e os números dos passos rolam
// como odômetro. Mobile: sem pin, anel one-shot; reduced: estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registrarMotion } from "@/lib/motion/registro";
import { odometro } from "@/lib/motion/texto";

registrarMotion();

export default function Cena04Portal({
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

      const processo = (ctx: gsap.Context) => {
        ctx.add(() => {
          q("[data-passo-num]").forEach((num, i) => {
            odometro(num, { trigger: num, start: "top 82%", once: true }, { delay: i * 0.08 });
          });
          // pictogramas autorais se desenham junto do passo
          q("[data-passo] [data-picto]").forEach((picto, i) => {
            gsap.fromTo(
              picto.querySelectorAll("path, circle, rect"),
              { drawSVG: "0%" },
              {
                drawSVG: "100%",
                duration: 1.1,
                ease: "andrade",
                stagger: 0.12,
                delay: (i % 4) * 0.08,
                scrollTrigger: { trigger: picto, start: "top 85%", once: true },
              },
            );
          });
          q("[data-passo]").forEach((passo, i) => {
            gsap.fromTo(
              passo,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: "andrade",
                delay: (i % 4) * 0.08,
                scrollTrigger: { trigger: passo, start: "top 85%", once: true },
              },
            );
          });
        });
      };

      mm.add(
        "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        (ctx) => {
          gsap.set(q("[data-portal-pergunta]"), { autoAlpha: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: q("[data-portal-palco]")[0],
              start: "top top",
              end: "+=150%",
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 4,
            },
          });

          tl.fromTo(
            q("[data-portal-anel] circle"),
            { drawSVG: "0%" },
            { drawSVG: "100%", ease: "none", duration: 0.4 },
            0,
          ).to(
            q("[data-portal-pergunta]"),
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.35, stagger: { amount: 0.25 } },
            0.45,
          );

          q("[data-portal-pergunta]").forEach((p, i) => {
            const rotulo = p.querySelector("[data-portal-rotulo]");
            if (rotulo) {
              tl.to(
                rotulo,
                {
                  duration: 0.12,
                  ease: "none",
                  scrambleText: { text: "{original}", chars: "perguntas?", speed: 0.9 },
                },
                0.5 + i * 0.07,
              );
            }
          });

          // o ponto nasce onde o anel termina de se desenhar e dá a volta
          // completa no scrub (MotionPath sobre o trilho invisível)
          const orbita = q("[data-portal-orbita]")[0];
          const dot = q("[data-portal-dot]")[0];
          if (orbita && dot) {
            tl.to(dot, { opacity: 1, duration: 0.06, ease: "none" }, 0.42).to(
              dot,
              {
                motionPath: {
                  path: orbita as unknown as SVGPathElement,
                  align: orbita as unknown as SVGPathElement,
                  alignOrigin: [0.5, 0.5],
                },
                ease: "none",
                duration: 0.55,
              },
              0.42,
            );
          }

          processo(ctx);
        },
      );

      mm.add(
        "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
        (ctx) => {
          // anel one-shot, perguntas em stagger normal
          gsap.fromTo(
            q("[data-portal-anel] circle"),
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.2,
              ease: "andrade",
              scrollTrigger: { trigger: q("[data-portal-palco]")[0], start: "top 70%", once: true },
            },
          );
          gsap.fromTo(
            q("[data-portal-pergunta]"),
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "andrade",
              stagger: 0.08,
              scrollTrigger: { trigger: q("[data-portal-perguntas]")[0], start: "top 80%", once: true },
            },
          );
          processo(ctx);
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-diagnostico" className={className} ref={ref}>
      {children}
    </section>
  );
}

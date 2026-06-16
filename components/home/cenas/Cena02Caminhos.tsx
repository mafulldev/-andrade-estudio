"use client";

// CAP 02 · DOIS CAMINHOS. Pinned (+=220%): o título entra por palavras, uma
// hairline vertical se DESENHA no centro (DrawSVG) dividindo a tela, os
// itens das duas faces alternam para dentro, os valores decodificam
// (ScrambleText no scrub) e, no fim, o conjunto converge levemente e a
// régua do comparador acende: a linha desenhada VIRA o handle arrastável.
// Mobile: sem pin; comparador em pilha; reveals one-shot.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export default function Cena02Caminhos({
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

      mm.add(
        "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
        (ctx) => {
          gsap.set(q("[data-caminhos-cabeca], [data-comparador], [data-caminhos-rodape]"), {
            autoAlpha: 0,
          });
          gsap.set(q("[data-regua]"), { autoAlpha: 0 });

          document.fonts.ready.then(() => {
            ctx.add(() => {
              const titulo = q("[data-caminhos-titulo]")[0];
              let palavras: Element[] = [];
              if (titulo) {
                const split = new SplitText(titulo, { type: "lines", mask: "lines" });
                splits.push(split);
                palavras = split.lines;
              }

              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: el,
                  start: "top top",
                  end: "+=220%",
                  scrub: 0.6,
                  pin: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  refreshPriority: 6,
                },
              });

              tl.set(q("[data-caminhos-cabeca]"), { autoAlpha: 1 }, 0)
                .fromTo(
                  palavras,
                  { yPercent: 112 },
                  { yPercent: 0, ease: "none", duration: 0.22, stagger: { amount: 0.1 } },
                  0,
                )
                .fromTo(
                  q("[data-caminhos-svg] line"),
                  { drawSVG: "50% 50%" },
                  { drawSVG: "0% 100%", ease: "none", duration: 0.3 },
                  0.08,
                )
                .set(q("[data-comparador]"), { autoAlpha: 1 }, 0.18)
                .fromTo(
                  q("[data-face='pronto'] > div"),
                  { xPercent: -6, autoAlpha: 0 },
                  { xPercent: 0, autoAlpha: 1, ease: "none", duration: 0.22 },
                  0.2,
                )
                .fromTo(
                  q("[data-face='sobmedida'] > div"),
                  { xPercent: 6, autoAlpha: 0 },
                  { xPercent: 0, autoAlpha: 1, ease: "none", duration: 0.22 },
                  0.2,
                )
                .fromTo(
                  q("[data-item]"),
                  { y: 18, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, ease: "none", duration: 0.3, stagger: { amount: 0.25 } },
                  0.34,
                );

              q("[data-valor]").forEach((valor, i) => {
                tl.to(
                  valor,
                  {
                    duration: 0.18,
                    ease: "none",
                    scrambleText: {
                      text: valor.getAttribute("data-valor") ?? "",
                      chars: "0123456789R$.",
                      speed: 0.6,
                    },
                  },
                  0.4 + i * 0.1,
                );
              });

              tl.to(q("[data-comparador]"), { scale: 0.96, transformOrigin: "50% 50%", ease: "none", duration: 0.2 }, 0.78)
                .fromTo(
                  q("[data-regua]"),
                  { autoAlpha: 0 },
                  { autoAlpha: 1, ease: "none", duration: 0.12 },
                  0.84,
                )
                .fromTo(
                  q("[data-caminhos-rodape]"),
                  { autoAlpha: 0, y: 28 },
                  { autoAlpha: 1, y: 0, ease: "none", duration: 0.16 },
                  0.84,
                );
            });
          });

          return () => {
            splits.forEach((sp) => sp.revert());
            splits.length = 0;
          };
        },
      );

      mm.add(
        "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            q("[data-caminhos-cabeca], [data-comparador], [data-caminhos-rodape]"),
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "andrade",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 75%", once: true },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-caminhos" className={className} ref={ref}>
      {children}
    </section>
  );
}

"use client";

// CAP 05 · O ESTÚDIO. Fluxo denso: os seis fatos reais rolam como odômetro
// (tabular-nums, one-shot) com rótulos decodificando; os três princípios
// revelam palavra a palavra no scrub; a rubrica dourada (ÚNICO acento
// DrawSVG do capítulo) se desenha sob o primeiro princípio; a faixa do
// estúdio ao vivo entra discreta. Reduced: tudo estático pelo gate.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { registrarMotion } from "@/lib/motion/registro";
import { odometro, scramble } from "@/lib/motion/texto";

registrarMotion();

export default function Cena05Estudio({
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
            // fatos: número odômetro + rótulo decodificando
            q("[data-fato]").forEach((fato, i) => {
              const numero = fato.querySelector("[data-fato-numero]");
              const rotulo = fato.querySelector("[data-fato-rotulo]");
              if (numero) {
                odometro(numero, { trigger: fato, start: "top 80%", once: true }, { delay: (i % 3) * 0.07 });
              }
              if (rotulo) {
                scramble(rotulo, { trigger: fato, start: "top 80%", once: true }, { delay: 0.2 + (i % 3) * 0.07 });
              }
            });

            // princípios: palavra a palavra no scrub
            q("[data-principio] blockquote").forEach((quote) => {
              const split = new SplitText(quote, { type: "words" });
              splits.push(split);
              gsap.fromTo(
                split.words,
                { opacity: 0.12 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: { amount: 0.8 },
                  scrollTrigger: {
                    trigger: quote,
                    start: "top 78%",
                    end: "top 32%",
                    scrub: 0.6,
                  },
                },
              );
            });

            // a rubrica dourada do fundador, desenhada uma única vez
            const rubrica = q("[data-rubrica] line")[0];
            if (rubrica) {
              gsap.fromTo(
                rubrica,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  duration: 0.85,
                  ease: "andrade",
                  scrollTrigger: { trigger: rubrica, start: "top 80%", once: true },
                },
              );
            }

            // assinaturas e faixa ao vivo
            gsap.utils
              .toArray<HTMLElement>([
                ...q("[data-principio] figcaption"),
                ...q(".aovivo"),
              ])
              .forEach((alvo) => {
                gsap.fromTo(
                  alvo,
                  { autoAlpha: 0, y: 28 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "andrade",
                    scrollTrigger: { trigger: alvo, start: "top 85%", once: true },
                  },
                );
              });
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
    <section id="cap-estudio" className={className} ref={ref}>
      {children}
    </section>
  );
}

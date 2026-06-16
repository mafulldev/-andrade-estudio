"use client";

// Controlador ÚNICO das fotografias [data-figura] (zero useGSAP por foto):
//   reveal   clip-path direcional 1.1s + scale interna 1.15 → 1 em 1.4s
//            (o atraso diferencial é o respiro) + véu recuando + legenda
//            (régua scaleX + texto), once "top 78%"
//   parallax contínuo em yPercent na camada interna (NUNCA no nó do clip),
//            amplitude pela prop data-parallax, scrub seco (o Lenis suaviza)
// ≤860px: amplitude reduzida e entrada só vertical; reduced-motion: nada
// (a foto nasce pronta). O hero tem coreografia própria (data-figura-hero
// é ignorado aqui).

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { registrarMotion } from "@/lib/motion/registro";
import { cena } from "@/lib/cena";

registrarMotion();

const CLIP_FECHADO: Record<string, string> = {
  baixo: "inset(0 0 100% 0)",
  esquerda: "inset(0 100% 0 0)",
  direita: "inset(0 0 0 100%)",
};

export default function Figuras() {
  const montado = useRef(false);

  useGSAP(() => {
    if (montado.current) return;
    montado.current = true;
    const mm = gsap.matchMedia();

    const coreografar = (amplitudeMax: number, soVertical: boolean) => {
      const figuras = gsap.utils.toArray<HTMLElement>(
        "[data-figura]:not([data-figura-hero])",
      );
      figuras.forEach((fig) => {
        const clip = fig.querySelector<HTMLElement>(".figura-clip");
        const inner = fig.querySelector<HTMLElement>(".figura-inner");
        const veu = fig.querySelector<HTMLElement>(".figura-veu");
        const regua = fig.querySelector<HTMLElement>(".figura-regua");
        const legenda = fig.querySelector<HTMLElement>(".figura-legenda .label");
        if (!clip || !inner) return;

        const amplitude =
          gsap.utils.clamp(-1, 1, Number(fig.dataset.parallax ?? "0.6")) *
          amplitudeMax;

        if (fig.dataset.revealFig === "cortina") {
          const direcao = soVertical ? "baixo" : (fig.dataset.direcao ?? "baixo");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: fig, start: "top 78%", once: true },
          });
          tl.fromTo(
            clip,
            { clipPath: CLIP_FECHADO[direcao] ?? CLIP_FECHADO.baixo },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "andrade" },
            0,
          ).fromTo(
            inner,
            { scale: 1.15 },
            { scale: 1, duration: 1.4, ease: "andrade" },
            0,
          );
          if (veu) {
            tl.fromTo(veu, { opacity: 1 }, { opacity: 0.55, duration: 0.85, ease: "andrade" }, 0.2);
          }
          if (regua) {
            tl.fromTo(
              regua,
              { scaleX: 0, transformOrigin: "left center" },
              { scaleX: 1, duration: 0.85, ease: "andrade" },
              0.35,
            );
          }
          if (legenda) {
            tl.fromTo(
              legenda,
              { x: -16, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.85, ease: "andrade" },
              0.43,
            );
          }
        }

        if (amplitude !== 0) {
          gsap.fromTo(
            inner,
            { yPercent: -Math.abs(amplitude) * Math.sign(amplitude || 1) },
            {
              yPercent: Math.abs(amplitude) * Math.sign(amplitude || 1),
              ease: "none",
              scrollTrigger: {
                trigger: fig,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    };

    mm.add(
      "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
      () => {
        coreografar(7, false);

        // velocity-skew sem Observer: o duto cena.velocidade (escrito pelo
        // provider a cada tick do Lenis) inclina as camadas internas das
        // fotos em até 2.5 graus, com lerp próprio. Mesmo dono (GSAP),
        // propriedade distinta do parallax (skewY vs yPercent).
        const inners = gsap.utils.toArray<HTMLElement>(
          "[data-figura]:not([data-figura-hero]) .figura-inner",
        );
        if (inners.length === 0) return;
        const skews = inners.map((n) =>
          gsap.quickTo(n, "skewY", { duration: 0.35, ease: "andrade" }),
        );
        let suave = 0;
        const tick = () => {
          suave += (cena.velocidade - suave) * 0.12;
          const alvo = gsap.utils.clamp(-2.5, 2.5, suave * 0.025);
          skews.forEach((to) => to(alvo));
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          gsap.set(inners, { skewY: 0 });
        };
      },
    );
    mm.add(
      "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
      () => coreografar(4, true),
    );

    return () => mm.revert();
  }, []);

  return null;
}

// Utilitários de texto cinético compartilhados pelas cenas.
//   odometro   número rola por caracteres mascarados (SplitText one-shot,
//              revertido ao completar; aria preservada)
//   scramble   rótulo decodifica até o texto original

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

export function odometro(
  el: Element,
  stVars?: ScrollTrigger.Vars,
  opts?: { delay?: number },
) {
  // SplitText 3.13+: máscara nativa por caractere e aria automático
  const split = new SplitText(el, { type: "chars", mask: "chars" });
  gsap.fromTo(
    split.chars,
    { yPercent: 120 },
    {
      yPercent: 0,
      duration: 1,
      ease: "andrade",
      stagger: 0.04,
      delay: opts?.delay ?? 0,
      scrollTrigger: stVars,
      onComplete: () => split.revert(),
    },
  );
}

export function scramble(
  el: Element,
  stVars?: ScrollTrigger.Vars,
  opts?: { delay?: number; chars?: string; duration?: number },
) {
  gsap.to(el, {
    duration: opts?.duration ?? 0.6,
    delay: opts?.delay ?? 0,
    // decodificação linear: scramble não rampa (regra das eases da casa)
    ease: "none",
    scrollTrigger: stVars,
    scrambleText: {
      text: "{original}",
      chars: opts?.chars ?? "andrade0123456789",
      speed: 0.8,
    },
  });
}

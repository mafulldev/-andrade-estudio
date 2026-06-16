"use client";

// CAP 03 · OS CINCO MODELOS. Desktop: trilho horizontal pinned com scrub e
// ARRASTE híbrido com inércia: o Draggable escreve no scroll (st.scroll()) e
// só o scrub escreve no transform; nunca dois donos do x. Por plate, via
// containerAnimation: nome por caracteres (one-shot ao cruzar o gatilho) e
// parallax sutil da textura da facade. Durante o detalhe (Flip), pausa
// Lenis e desabilita o drag via CustomEvent "modelos:detalhe".
// Mobile: lista vertical natural com reveals; sem pin, sem Draggable.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { useLenis } from "@/components/LenisProvider";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export default function Cena03Modelos({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { obter, parar, seguir } = useLenis();

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
          const trilho = q("[data-trilho]")[0] as HTMLElement | undefined;
          if (!trilho) return;

          const distancia = () => Math.max(trilho.scrollWidth - window.innerWidth, 1);

          const tween = gsap.to(trilho, {
            x: () => -distancia(),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => "+=" + distancia(),
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 5,
            },
          });
          const st = tween.scrollTrigger!;

          /* arraste híbrido: o proxy escreve no scroll, o scrub no transform */

          const proxy = document.createElement("div");
          let scrollInicial = 0;
          let arrastou = false;

          const arrastavel = Draggable.create(proxy, {
            type: "x",
            trigger: trilho,
            inertia: true,
            onPress() {
              parar();
              scrollInicial = st.scroll();
              gsap.set(proxy, { x: 0 });
              arrastou = false;
            },
            onDrag() {
              if (Math.abs(this.x) > 6) {
                arrastou = true;
                trilho.dataset.arrastando = "1";
              }
              st.scroll(gsap.utils.clamp(st.start, st.end, scrollInicial - this.x));
            },
            onThrowUpdate() {
              st.scroll(gsap.utils.clamp(st.start, st.end, scrollInicial - this.x));
            },
            onRelease() {
              const d = this as unknown as { isThrowing?: boolean };
              if (!d.isThrowing) soltar();
            },
            onThrowComplete: () => soltar(),
          })[0];

          const soltar = () => {
            delete trilho.dataset.arrastando;
            obter()?.scrollTo(window.scrollY, { immediate: true });
            seguir();
          };

          // um arraste de verdade não vira clique acidental num plate
          const suprimirClique = (e: MouseEvent) => {
            if (arrastou) {
              e.preventDefault();
              e.stopPropagation();
              arrastou = false;
            }
          };
          trilho.addEventListener("click", suprimirClique, true);

          /* detalhe aberto (Flip do showcase): congela o palco */

          const aoDetalhe = (e: Event) => {
            const aberto = (e as CustomEvent<{ aberto: boolean }>).detail.aberto;
            if (aberto) {
              parar();
              arrastavel.disable();
            } else {
              seguir();
              arrastavel.enable();
            }
          };
          window.addEventListener("modelos:detalhe", aoDetalhe);

          /* por plate, dirigido pela posição no trilho */

          document.fonts.ready.then(() => {
            ctx.add(() => {
              q("[data-plate]").forEach((plate) => {
                const nome = plate.querySelector("[data-plate-nome]");
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
                      scrollTrigger: {
                        trigger: plate,
                        containerAnimation: tween,
                        start: "left 75%",
                        once: true,
                      },
                    },
                  );
                }
                const textura = plate.querySelector("[data-preview] [data-capa-arte]");
                if (textura) {
                  gsap.fromTo(
                    textura,
                    { xPercent: 10 },
                    {
                      xPercent: -10,
                      ease: "none",
                      scrollTrigger: {
                        trigger: plate,
                        containerAnimation: tween,
                        start: "left right",
                        end: "right left",
                        scrub: true,
                      },
                    },
                  );
                }
              });
              ScrollTrigger.refresh();
            });
          });

          return () => {
            window.removeEventListener("modelos:detalhe", aoDetalhe);
            trilho.removeEventListener("click", suprimirClique, true);
            arrastavel.kill();
            splits.forEach((sp) => sp.revert());
            splits.length = 0;
          };
        },
      );

      mm.add(
        "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
        () => {
          q("[data-plate], [data-plate-intro]").forEach((plate) => {
            gsap.fromTo(
              plate,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: "andrade",
                scrollTrigger: { trigger: plate, start: "top 82%", once: true },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section id="cap-modelos" className={className} ref={ref}>
      {children}
    </section>
  );
}

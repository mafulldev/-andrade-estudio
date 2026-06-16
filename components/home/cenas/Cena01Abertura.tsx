"use client";

// CAP 01 · ABERTURA "ASSINATURA ANDRADE" (linha cursiva). A assinatura é uma
// LINHA ÚNICA legível que se DESENHA (DrawSVG) com o ponto âmbar como ponta da
// caneta; depois fica viva e os pontos perto do cursor inclinam na direção dele
// (o fio segue a mão), de leve para as letras seguirem legíveis. Coluna direita.
//   1. ENTRADA: DrawSVG do traço + ponta lidera + headline por máscara. Lenis
//      travado; liberado quando o nome se forma.
//   2. VIDA: tick no gsap.ticker recomputa os pontos (ondulação sutil + puxão do
//      cursor) e reescreve o `d`; o ponto âmbar percorre o nome.
// O `d` base é amostrado UMA vez do bezier do markup (getPointAtLength); o loop
// só interpola/escreve, limitado a ~45fps (sem getPointAtLength por frame).
// Mobile: desenha curto, sem warp. Reduced-motion: bezier estático, sem trava.

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/ScrollSceneProvider";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

const VBW = 1000;
const VBH = 300;

function suaveSub(pts: Array<[number, number]>): string {
  if (!pts.length) return "";
  if (pts.length === 1) return `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const n = pts.length;
  d += ` L${pts[n - 1][0].toFixed(1)} ${pts[n - 1][1].toFixed(1)}`;
  return d;
}

// curva suave que RESPEITA os pen-lifts: um salto grande entre pontos (a caneta
// levantando entre letras) vira um novo subpath (M), em vez de uma linha ligando.
function suave(pts: Array<[number, number]>): string {
  if (pts.length < 2) return "";
  const LIMITE = 52;
  const partes: Array<Array<[number, number]>> = [];
  let atual: Array<[number, number]> = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d > LIMITE) {
      partes.push(atual);
      atual = [pts[i]];
    } else {
      atual.push(pts[i]);
    }
  }
  partes.push(atual);
  return partes.map((p) => suaveSub(p)).join(" ");
}

function pontoEm(pts: Array<[number, number]>, t: number): [number, number] {
  const c = Math.min(Math.max(t, 0), 1) * (pts.length - 1);
  const i = Math.min(Math.floor(c), pts.length - 2);
  const f = c - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
}

export default function Cena01Abertura({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { parar, seguir } = useLenis();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const splits: SplitText[] = [];

      const traco = q("[data-hero-traco]")[0] as unknown as SVGPathElement | undefined;
      const ponta = q("[data-hero-ponta]")[0] as HTMLElement | undefined;
      const palco = q("[data-hero-palco]")[0] as HTMLElement | undefined;
      if (!traco || !ponta || !palco) return;

      const N = 120;
      const lenTotal = traco.getTotalLength();
      const BASE: Array<[number, number]> = [];
      for (let i = 0; i <= N; i++) {
        const p = traco.getPointAtLength((lenTotal * i) / N);
        BASE.push([p.x, p.y]);
      }

      let dimW = 0;
      let dimH = 0;
      let tick: ((time: number, deltaTime: number) => void) | null = null;
      let aoMover: ((e: PointerEvent) => void) | null = null;
      let aoSair: (() => void) | null = null;
      let aoResize: (() => void) | null = null;

      const medir = () => {
        const r = palco.getBoundingClientRect();
        dimW = r.width;
        dimH = r.height;
      };

      const liberar = () => {
        document.body.style.overflow = "";
        seguir();
      };

      const colocarPonta = (vx: number, vy: number) => {
        if (!dimW) return;
        gsap.set(ponta, { x: (vx / VBW) * dimW, y: (vy / VBH) * dimH });
      };

      const revelarTexto = (tl: gsap.core.Timeline, em: number) => {
        const titulo = q("[data-hero-titulo]")[0];
        if (titulo) {
          const sp = new SplitText(titulo, { type: "lines", mask: "lines" });
          splits.push(sp);
          gsap.set(sp.lines, { yPercent: 120 });
          tl.to(sp.lines, { yPercent: 0, duration: 1, ease: "andrade", stagger: 0.12 }, em);
        }
        tl.fromTo(q("[data-hero-eyebrow]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "andrade" }, em);
        tl.fromTo(q("[data-hero-apoio]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "andrade" }, em + 0.35);
        tl.fromTo(q("[data-hero-acoes]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "andrade" }, em + 0.5);
        tl.fromTo(q("[data-hero-assinatura]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "andrade" }, em + 0.7);
        tl.fromTo(q("[data-hero-scroll]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: "andrade" }, em + 0.9);
      };

      // a linha viva: ondulação sutil + puxão do cursor (o fio segue a mão)
      const iniciarVida = () => {
        if (!el.isConnected) return;
        medir();
        gsap.set(ponta, { autoAlpha: 1 });

        const RAIO = 150;
        const FORCA = 28;
        const atual = BASE.map(([x, y]) => [x, y] as [number, number]);
        const alvo = { x: -9999, y: -9999, ativo: 0 };
        const cur = { x: -9999, y: -9999, ativo: 0 };
        let prog = 0;
        let acc = 100;

        aoMover = (e) => {
          const r = palco.getBoundingClientRect();
          alvo.x = ((e.clientX - r.left) / r.width) * VBW;
          alvo.y = ((e.clientY - r.top) / r.height) * VBH;
          alvo.ativo = 1;
        };
        aoSair = () => {
          alvo.ativo = 0;
        };
        aoResize = medir;
        el.addEventListener("pointermove", aoMover);
        el.addEventListener("pointerleave", aoSair);
        window.addEventListener("resize", aoResize);

        tick = (time, deltaTime) => {
          acc += deltaTime;
          if (acc < 22) return;
          const dt = Math.min(acc / 1000, 0.05);
          acc = 0;
          cur.x += (alvo.x - cur.x) * 0.12;
          cur.y += (alvo.y - cur.y) * 0.12;
          cur.ativo += (alvo.ativo - cur.ativo) * 0.08;

          const pts = BASE.map(([bx, by], i) => {
            let x = bx + Math.sin(time * 0.5 + i * 0.18) * 0.5;
            let y = by + Math.cos(time * 0.45 + i * 0.16) * 0.6;
            if (cur.ativo > 0.01) {
              const dx = cur.x - x;
              const dy = cur.y - y;
              const dist = Math.hypot(dx, dy) || 1;
              const f = Math.exp(-(dist * dist) / (RAIO * RAIO)) * FORCA * cur.ativo;
              x += (dx / dist) * f;
              y += (dy / dist) * f;
            }
            atual[i][0] += (x - atual[i][0]) * 0.2;
            atual[i][1] += (y - atual[i][1]) * 0.2;
            return atual[i];
          });

          traco.setAttribute("d", suave(pts));
          prog = (prog + dt * 0.045) % 1;
          const tt = prog < 0.5 ? prog * 2 : (1 - prog) * 2;
          const [vx, vy] = pontoEm(pts, tt);
          colocarPonta(vx, vy);
        };
        gsap.ticker.add(tick);
      };

      const limparVida = () => {
        if (tick) {
          gsap.ticker.remove(tick);
          tick = null;
        }
        if (aoMover) el.removeEventListener("pointermove", aoMover);
        if (aoSair) el.removeEventListener("pointerleave", aoSair);
        if (aoResize) window.removeEventListener("resize", aoResize);
        aoMover = aoSair = aoResize = null;
      };

      // ---- DESKTOP: a assinatura se desenha + segue a mão ----
      mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", (ctx) => {
        let ativo = true;
        gsap.set(traco, { drawSVG: "0%" });
        gsap.set(q("[data-hero-eyebrow], [data-hero-apoio], [data-hero-acoes], [data-hero-assinatura], [data-hero-scroll]"), { autoAlpha: 0 });
        gsap.set(ponta, { autoAlpha: 0, xPercent: -50, yPercent: -50 });

        parar();
        document.body.style.overflow = "hidden";

        document.fonts.ready.then(() => {
          if (!ativo || !el.isConnected) {
            liberar();
            return;
          }
          ctx.add(() => {
            medir();
            colocarPonta(BASE[0][0], BASE[0][1]);
            const tl = gsap.timeline();

            tl.set(ponta, { autoAlpha: 1 }, 0.2);
            tl.fromTo(
              { p: 0 },
              { p: 0 },
              {
                p: 1,
                duration: 2.8,
                ease: "andrade",
                onUpdate() {
                  const p = (this.targets()[0] as { p: number }).p;
                  gsap.set(traco, { drawSVG: `0% ${(p * 100).toFixed(2)}%` });
                  const [vx, vy] = pontoEm(BASE, p);
                  colocarPonta(vx, vy);
                },
              },
              0.2,
            );

            revelarTexto(tl, 0.9);

            tl.call(liberar, [], 2.4);
            tl.call(() => gsap.set(traco, { clearProps: "strokeDasharray,strokeDashoffset" }), [], 2.82);
            tl.call(iniciarVida, [], 2.86);

            gsap.to(q("[data-hero-palco]"), {
              autoAlpha: 0.4,
              yPercent: -6,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top top", end: "+=65%", scrub: true },
            });
          });
        });

        return () => {
          ativo = false;
          liberar();
          limparVida();
          splits.forEach((sp) => sp.revert());
          splits.length = 0;
        };
      });

      // ---- MOBILE: desenha curto, sem warp ----
      mm.add("(max-width: 860px) and (prefers-reduced-motion: no-preference)", (ctx) => {
        let ativo = true;
        gsap.set(traco, { drawSVG: "0%" });
        gsap.set(q("[data-hero-eyebrow], [data-hero-apoio], [data-hero-acoes], [data-hero-assinatura], [data-hero-scroll]"), { autoAlpha: 0 });
        gsap.set(ponta, { autoAlpha: 0 });

        parar();
        document.body.style.overflow = "hidden";

        document.fonts.ready.then(() => {
          if (!ativo || !el.isConnected) {
            liberar();
            return;
          }
          ctx.add(() => {
            const tl = gsap.timeline();
            tl.to(traco, { drawSVG: "100%", duration: 2, ease: "andrade" }, 0.1);
            revelarTexto(tl, 0.6);
            tl.call(liberar, [], 1.7);
          });
        });

        return () => {
          ativo = false;
          liberar();
          splits.forEach((sp) => sp.revert());
          splits.length = 0;
        };
      });

      return () => {
        mm.revert();
        limparVida();
        ScrollTrigger.getAll().forEach((s) => {
          if (s.trigger === el) s.kill();
        });
      };
    },
    { scope: ref },
  );

  return (
    <section id="cap-abertura" className={className} ref={ref}>
      {children}
    </section>
  );
}

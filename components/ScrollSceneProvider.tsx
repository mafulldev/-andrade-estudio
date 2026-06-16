"use client";

// ScrollSceneProvider: a fundação do movimento.
// Lenis 1.3 (lerp 0.09, autoRaf:false EXPLÍCITO: o ticker GSAP é o único
// dono do tempo; syncTouch:false: o toque fica nativo no iOS, os pins já
// não existem no mobile), dirigido pelo gsap.ticker; scrollTo sempre com a
// curva da casa (easingCasa) e duração proporcional à distância; scroll
// restoration manual por rota (sessionStorage): push volta ao topo atrás
// do véu, back/forward restaura a posição APÓS o refresh dos pins.
// Gate de revelação à prova de falha (html.cena-pronta + [data-reveal]) e
// modo de inspeção ?debug=1 (markers, FPS, velocity, contornos).
// Também veste a casca do Motion (LazyMotion strict + MotionConfig):
// doutrina em lib/motion/registro.ts.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { cena } from "@/lib/cena";
import { registrarMotion } from "@/lib/motion/registro";
import { easingCasa, duracaoRolagem } from "@/lib/motion/eases";

gsap.registerPlugin(useGSAP);
registrarMotion();

// Modo de inspeção, decidido na importação do módulo (antes de qualquer
// render): assim os defaults valem para TODOS os triggers, inclusive os
// criados pelos filhos antes do efeito do provider.
const DEBUG =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("debug");

if (DEBUG) {
  document.documentElement.dataset.debug = "1";
  ScrollTrigger.defaults({ markers: true });
}

type Cena = {
  obter: () => Lenis | null;
  parar: () => void;
  seguir: () => void;
  irPara: (alvo: string | number) => void;
};

const Contexto = createContext<Cena>({
  obter: () => null,
  parar: () => {},
  seguir: () => {},
  irPara: () => {},
});

export function useLenis() {
  return useContext(Contexto);
}

const CHAVE_SCROLL = (rota: string) => `andrade:scroll:${rota}`;

export default function ScrollSceneProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const popstateRef = useRef(false);
  const path = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // restoration manual: o site decide quando e para onde rolar
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const aoVoltar = () => {
      popstateRef.current = true;
    };
    window.addEventListener("popstate", aoVoltar);

    let lenis: Lenis | null = null;
    let tick: ((tempo: number) => void) | null = null;
    let salvarTimer = 0;
    if (!reduzido) {
      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        // o ticker do GSAP é o ÚNICO loop; nunca deixar o default decidir
        autoRaf: false,
        // toque nativo: sem pins no mobile, momentum do iOS preservado
        syncTouch: false,
        anchors: false,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      // posição por rota, com folga (sessionStorage é barato, mas não no tick)
      lenis.on("scroll", () => {
        if (salvarTimer) return;
        salvarTimer = window.setTimeout(() => {
          salvarTimer = 0;
          try {
            sessionStorage.setItem(
              CHAVE_SCROLL(window.location.pathname),
              String(Math.round(window.scrollY)),
            );
          } catch {}
        }, 180);
      });
      tick = (tempo: number) => {
        lenis!.raf(tempo * 1000);
        // velocidade do scroll: canal compartilhado para efeitos reativos
        cena.velocidade = lenis!.velocity;
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Os useGSAP dos filhos já rodaram (layout effects sobem da folha para a
    // raiz): os gsap.set iniciais estão aplicados. Pode revelar sem flash.
    html.classList.add("cena-pronta");

    // medidor de FPS + velocity do modo debug
    let fpsEl: HTMLDivElement | null = null;
    let fpsTick: (() => void) | null = null;
    if (DEBUG) {
      fpsEl = document.createElement("div");
      fpsEl.className = "fps-medidor";
      fpsEl.textContent = "FPS --";
      document.body.appendChild(fpsEl);
      let quadros = 0;
      let inicio = performance.now();
      fpsTick = () => {
        quadros += 1;
        const agora = performance.now();
        if (agora - inicio >= 500) {
          const fps = Math.round((quadros * 1000) / (agora - inicio));
          const v = Math.round(cena.velocidade);
          fpsEl!.textContent = `FPS ${fps} · v ${v}`;
          quadros = 0;
          inicio = agora;
        }
      };
      gsap.ticker.add(fpsTick);
    }

    return () => {
      window.removeEventListener("popstate", aoVoltar);
      if (salvarTimer) window.clearTimeout(salvarTimer);
      if (tick) gsap.ticker.remove(tick);
      if (fpsTick) gsap.ticker.remove(fpsTick);
      fpsEl?.remove();
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // chegada numa rota: push volta ao topo; back/forward restaura a posição
  // salva DEPOIS do layout com pins recalculado (double-rAF + refresh)
  useEffect(() => {
    // o Next pode re-afirmar "auto" na hidratação do router: o manual
    // é re-imposto a cada chegada de rota
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const foiPopstate = popstateRef.current;
    popstateRef.current = false;
    const lenis = lenisRef.current;

    let alvo = 0;
    if (foiPopstate) {
      try {
        alvo = Number(sessionStorage.getItem(CHAVE_SCROLL(path)) ?? "0") || 0;
      } catch {}
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (lenis) {
          lenis.scrollTo(alvo, { immediate: true, force: true });
        } else {
          window.scrollTo(0, alvo);
        }
      });
    });
  }, [path]);

  const obter = useCallback(() => lenisRef.current, []);
  const parar = useCallback(() => lenisRef.current?.stop(), []);
  const seguir = useCallback(() => lenisRef.current?.start(), []);
  const irPara = useCallback((alvo: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      const destino =
        typeof alvo === "number"
          ? alvo
          : (document.querySelector(alvo)?.getBoundingClientRect().top ?? 0) +
            window.scrollY;
      lenis.scrollTo(alvo, {
        duration: duracaoRolagem(destino - window.scrollY),
        easing: easingCasa,
      });
    } else if (typeof alvo === "string") {
      document.querySelector(alvo)?.scrollIntoView();
    } else {
      window.scrollTo(0, alvo);
    }
  }, []);

  return (
    <Contexto.Provider value={{ obter, parar, seguir, irPara }}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </Contexto.Provider>
  );
}

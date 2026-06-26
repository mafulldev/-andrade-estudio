"use client";

// MENU OVERLAY SOLACE: cobertura única que abre por clip-path
// inset(0 0 100% 0) -> inset(0) em 1s; links serif gigantes com índices e
// entrada em stagger de 80ms; aside lateral com endereço, contato e redes
// separado por hairline. Esc fecha, foco preso e devolvido, Lenis pausado,
// body sem scroll enquanto aberto. Reduced-motion: estados finais diretos.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { useLenis } from "@/components/LenisProvider";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

const ITENS: { num: string; rotulo: string; hash?: string; href?: string }[] = [
  { num: "01", rotulo: "Início", hash: "#cap-abertura" },
  { num: "02", rotulo: "Soluções", hash: "#cap-caminhos" },
  { num: "03", rotulo: "Projetos", hash: "#cap-modelos" },
  { num: "04", rotulo: "Diagnóstico", href: "/diagnostico" },
  { num: "05", rotulo: "Estúdio", hash: "#cap-estudio" },
  { num: "06", rotulo: "Bastidores", hash: "#cap-bastidores" },
  { num: "07", rotulo: "Investimento", hash: "#cap-investimento" },
  { num: "08", rotulo: "Contato", hash: "#cap-final" },
  { num: "09", rotulo: "Conceitos", href: "/conceitos" },
];

const EMAIL = "ma.fulldev@gmail.com";
const WHATSAPP = "https://wa.me/5519971460099";

export default function MenuOverlay({
  aberto,
  aoFechar,
}: {
  aberto: boolean;
  aoFechar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const jaAbriuRef = useRef(false);
  const path = usePathname();
  const { parar, seguir, irPara } = useLenis();

  // abrir e fechar: cobertura única por clip-path
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const q = gsap.utils.selector(el);
    let tl: gsap.core.Timeline | null = null;

    if (aberto) {
      jaAbriuRef.current = true;
      parar();
      document.body.style.overflow = "hidden";
      gsap.set(el, { visibility: "visible" });
      tl = gsap.timeline();
      tl.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "cortina" },
        0,
      )
        .fromTo(
          q(".mi-inner"),
          { yPercent: 70, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "andrade",
            stagger: 0.08,
          },
          0.25,
        )
        .fromTo(
          q(".menu-anim"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.85, ease: "andrade", stagger: 0.08 },
          0.45,
        );
      if (reduzido) tl.progress(1);
    } else if (jaAbriuRef.current) {
      document.body.style.overflow = "";
      seguir();
      tl = gsap.timeline({
        onComplete: () => gsap.set(el, { visibility: "hidden" }),
      });
      tl.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: "cortina",
      });
      if (reduzido) tl.progress(1);
    }

    return () => {
      tl?.kill();
    };
  }, [aberto, parar, seguir]);

  // segurança na desmontagem: scroll liberado
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  // micro: o índice do item decodifica ao passar o ponteiro (só dígitos)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const aoEntrar = (e: Event) => {
      const link =
        e.target instanceof Element ? e.target.closest(".menu-item a") : null;
      const num = link?.querySelector(".mi-num");
      if (!num || gsap.isTweening(num)) return;
      gsap.to(num, {
        duration: 0.45,
        ease: "none",
        scrambleText: { text: "{original}", chars: "0123456789", speed: 1.2 },
      });
    };
    el.addEventListener("pointerover", aoEntrar);
    return () => el.removeEventListener("pointerover", aoEntrar);
  }, []);

  // foco preso e Esc
  useEffect(() => {
    if (!aberto) return;
    const el = ref.current;
    if (!el) return;
    const anterior =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const focaveis = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
    focaveis()[0]?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        aoFechar();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focaveis();
      if (f.length === 0) return;
      const primeiro = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      anterior?.focus();
    };
  }, [aberto, aoFechar]);

  const emHome = path === "/";
  const cliqueItem = (hash?: string) => (e: MouseEvent) => {
    aoFechar();
    if (hash && emHome) {
      e.preventDefault();
      window.setTimeout(() => irPara(hash), 500);
    }
  };

  return (
    <div
      className="menu"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!aberto}
      data-lenis-prevent
    >
      <div className="menu-esq">
        <div className="menu-topo">
          <span className="cab-wordmark">A N D R A D E</span>
          <button
            type="button"
            className="menu-fechar"
            onClick={aoFechar}
            aria-label="Fechar menu"
            data-cursor="FECHAR"
          >
            <span />
            <span />
          </button>
        </div>

        <nav aria-label="Seções do site">
          <ul className="menu-lista">
            {ITENS.map((item) => (
              <li className="menu-item" key={item.num}>
                <Link
                  href={item.href ?? (emHome ? item.hash! : `/${item.hash}`)}
                  onClick={cliqueItem(item.hash)}
                >
                  <span className="mi-inner">
                    <span className="mi-num">{item.num}</span>
                    <span className="mi-rotulo">{item.rotulo}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-rodape">
          <span className="label">Estúdio digital</span>
        </div>
      </div>

      <div className="menu-dir">
        <div className="menu-aside">
          <div className="menu-aside-bloco menu-anim">
            <span className="label">Endereço</span>
            <p className="mudo">
              Sumaré, São Paulo.
              <br />
              Atendimento remoto para o Brasil inteiro.
            </p>
          </div>
          <div className="menu-aside-bloco menu-anim">
            <span className="label">Contato</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
          <div className="menu-aside-bloco menu-anim">
            <span className="label">Redes</span>
            <a
              href="https://github.com/mafulldev"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="menu-dir-rodape menu-anim">
          <Link href="/privacidade" className="label" onClick={aoFechar}>
            Política de privacidade
          </Link>
          <span className="monograma" aria-hidden="true">
            A
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

// Os cinco plates do trilho horizontal + o detalhe em camada fixa.
// Estado central: no máximo UMA prévia viva (ativoSlug) e um detalhe por vez.
// O detalhe abre com Flip de verdade: captura o estado encaixado sobre o
// plate (Flip.fit), limpa para o estado final fullscreen e anima com
// Flip.from na ease "cortina". Durante o detalhe, dispara o CustomEvent
// "modelos:detalhe" para a Cena03 pausar Lenis/drag e travar refresh.

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import PreviewDemo from "@/components/PreviewDemo";
import { BotaoLinha } from "@/components/Botoes";
import { registrarMotion } from "@/lib/motion/registro";
import { trackEvento } from "@/lib/eventos";
import s from "./showcase.module.css";

registrarMotion();

export const MODELOS = [
  {
    slug: "brasa",
    nome: "BRASA",
    nicho: "Restaurantes e food",
    assinatura: "Cardápio que acende em brasa ao toque do cursor.",
  },
  {
    slug: "vitta",
    nome: "VITTA",
    nicho: "Saúde e clínicas",
    assinatura: "Linha de pulso desenhando o cuidado.",
  },
  {
    slug: "foro",
    nome: "FORO",
    nicho: "Advocacia",
    assinatura: "Sublinhado caligráfico sob os termos-chave.",
  },
  {
    slug: "prumo",
    nome: "PRUMO",
    nicho: "Serviços locais",
    assinatura: "Antes e depois arrastável, no mouse e no toque.",
  },
  {
    slug: "solar",
    nome: "SOLAR",
    nicho: "Imobiliário",
    assinatura: "Microgaleria por dots com contra-parallax.",
  },
];

const INCLUSO = [
  "Identidade e textos aplicados",
  "No ar em 1 dia útil",
  "Uma rodada de ajustes inclusa",
  "Domínio e hospedagem em seu nome",
  "Código entregue",
];

export default function ShowcaseModelos() {
  const [ativoSlug, setAtivoSlug] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<number | null>(null);
  const detalheRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<(HTMLElement | null)[]>([]);
  const origemRef = useRef<HTMLButtonElement | null>(null);

  const abrirDetalhe = (i: number, origem: HTMLButtonElement) => {
    origemRef.current = origem;
    trackEvento("demo_view", { slug: MODELOS[i].slug, origem: "detalhe" });
    window.dispatchEvent(
      new CustomEvent("modelos:detalhe", { detail: { aberto: true } }),
    );
    setDetalhe(i);
  };

  const fecharDetalhe = () => {
    const el = detalheRef.current;
    const plate = detalhe !== null ? plateRefs.current[detalhe] : null;
    const reduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const encerrar = () => {
      setDetalhe(null);
      window.dispatchEvent(
        new CustomEvent("modelos:detalhe", { detail: { aberto: false } }),
      );
      origemRef.current?.focus();
    };
    if (!el || !plate || reduzido) {
      encerrar();
      return;
    }
    // Flip reverso: do fullscreen de volta ao retângulo do plate
    let encerrado = false;
    const encerrarUmaVez = () => {
      if (encerrado) return;
      encerrado = true;
      gsap.set(el, { clearProps: "all" });
      encerrar();
    };
    const estado = Flip.getState(el);
    Flip.fit(el, plate, { scale: true });
    Flip.from(estado, {
      duration: 0.65,
      ease: "cortina",
      onComplete: encerrarUmaVez,
    });
    // seguro: se o tween não puder rodar, o detalhe fecha mesmo assim
    window.setTimeout(encerrarUmaVez, 900);
  };

  // Flip de abertura + Esc + foco
  useEffect(() => {
    if (detalhe === null) return;
    const el = detalheRef.current;
    const plate = plateRefs.current[detalhe];
    const reduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (el && plate && !reduzido) {
      Flip.fit(el, plate, { scale: true });
      const estado = Flip.getState(el);
      gsap.set(el, { clearProps: "transform,width,height" });
      Flip.from(estado, { duration: 0.8, ease: "cortina", scale: true });
    }

    el?.querySelector<HTMLButtonElement>("[data-fechar]")?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharDetalhe();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalhe]);

  const mo = detalhe !== null ? MODELOS[detalhe] : null;

  return (
    <>
      {MODELOS.map((m, i) => (
        <article
          className={s.plate}
          key={m.slug}
          data-plate={m.slug}
          ref={(el) => {
            plateRefs.current[i] = el;
          }}
        >
          <div className={s.plateCabeca}>
            <h3 className={s.plateNome} data-plate-nome>
              {m.nome}
            </h3>
            <span className={s.plateIndice}>0{i + 1} / 05</span>
          </div>

          <PreviewDemo
            slug={m.slug}
            nome={m.nome}
            nicho={m.nicho}
            ativo={ativoSlug === m.slug}
            aoAtivar={() => setAtivoSlug(m.slug)}
            aoFechar={() => setAtivoSlug(null)}
          />

          <div className={s.plateRodape}>
            <p className={s.plateAssinatura}>{m.assinatura}</p>
            <span className={s.plateAcoes}>
              <button
                type="button"
                className="botao-linha botao-linha--compacto"
                data-cursor="VER"
                onClick={(e) => abrirDetalhe(i, e.currentTarget)}
              >
                <span>Detalhe</span>
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </span>
          </div>
        </article>
      ))}

      {/* detalhe em camada fixa */}
      <div
        className={s.detalhe}
        ref={detalheRef}
        data-aberto={detalhe !== null ? "1" : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={mo ? `Detalhe do modelo ${mo.nome}` : "Detalhe do modelo"}
      >
        {mo && (
          <>
            <div className={s.detalheTopo}>
              <span className={s.detalheNome}>{mo.nome}</span>
              <span className={s.detalheAcoes}>
                <a
                  className="botao-linha botao-linha--compacto"
                  href={`/demos/${mo.slug}`}
                  data-evento="demo_view"
                >
                  <span>Abrir o site completo</span>
                </a>
                <button
                  type="button"
                  className="botao-linha botao-linha--compacto"
                  onClick={fecharDetalhe}
                  data-fechar
                >
                  <span>Fechar</span>
                </button>
              </span>
            </div>
            <div className={s.detalheCorpo}>
              <div className={s.detalhePalco}>
                <iframe
                  src={`/demos/${mo.slug}`}
                  title={`Modelo ${mo.nome} ao vivo`}
                />
              </div>
              <aside className={s.detalheInfo}>
                <span className="label">{mo.nicho}</span>
                <p>{mo.assinatura}</p>
                <ul className={s.detalheLista}>
                  {INCLUSO.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <BotaoLinha
                  primario
                  href="/diagnostico"
                  cursor="INICIAR"
                  onClick={() =>
                    trackEvento("demo_quero_click", { slug: mo.slug })
                  }
                >
                  Quero este modelo
                </BotaoLinha>
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
}

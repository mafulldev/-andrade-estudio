"use client";

// Prévia viva de uma demo: facade tipográfica leve por padrão; o iframe REAL
// (/demos/{slug}) só monta quando o visitante pede, escalado de 1280×800
// (390×740 no mobile) para caber no palco via ResizeObserver. Controlado
// pelo pai (ShowcaseModelos): no máximo 1 prévia viva por vez. Esc fecha e
// devolve o foco ao botão de origem. Zero iframes no HTML inicial.

import { useEffect, useRef, useState } from "react";
import { trackEvento } from "@/lib/eventos";
import s from "./preview.module.css";

export default function PreviewDemo({
  slug,
  nome,
  nicho,
  ativo,
  aoAtivar,
  aoFechar,
}: {
  slug: string;
  nome: string;
  nicho: string;
  ativo: boolean;
  aoAtivar: () => void;
  aoFechar: () => void;
}) {
  const palcoRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const [carregou, setCarregou] = useState(false);

  // escala do iframe pelo tamanho real do palco
  useEffect(() => {
    if (!ativo) return;
    const palco = palcoRef.current;
    if (!palco) return;
    const base = window.matchMedia("(max-width: 860px)").matches ? 390 : 1280;
    const medir = () => {
      palco.style.setProperty("--escala", String(palco.clientWidth / base));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(palco);
    return () => ro.disconnect();
  }, [ativo]);

  // Esc dentro do palco fecha e devolve o foco
  useEffect(() => {
    if (!ativo) return;
    setCarregou(false);
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        aoFechar();
        botaoRef.current?.focus();
      }
    };
    const palco = palcoRef.current;
    palco?.addEventListener("keydown", aoTeclar);
    return () => palco?.removeEventListener("keydown", aoTeclar);
  }, [ativo, aoFechar]);

  return (
    <div
      className={s.palco}
      ref={palcoRef}
      data-vivo={ativo && carregou ? "1" : undefined}
      data-preview={slug}
    >
      {!ativo && (
        <div className={s.capa}>
          <div className={s.capaFundo} aria-hidden="true">
            {/* arte autoral do nicho, desenhada pelo próprio estúdio */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/modelos/${slug}.svg`} alt="" data-capa-arte />
          </div>
          <span className={s.capaNome}>{nome}</span>
          <span className={s.capaNicho}>{nicho}</span>
          <span className={s.capaAcao}>
            <button
              type="button"
              className="botao-linha botao-linha--compacto"
              ref={botaoRef}
              aria-expanded={false}
              data-cursor="VIVO"
              onClick={() => {
                trackEvento("demo_view", { slug, origem: "preview" });
                aoAtivar();
              }}
            >
              <span>Prévia interativa</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5Z" />
              </svg>
            </button>
          </span>
        </div>
      )}

      {ativo && (
        <>
          <div className={s.barra}>
            <span className={s.barraNome}>
              {nome} · demonstração ao vivo
            </span>
            <span className={s.barraAcoes}>
              <a href={`/demos/${slug}`} target="_blank" rel="noopener noreferrer">
                Abrir em nova aba
              </a>
              <button type="button" onClick={aoFechar}>
                Fechar prévia
              </button>
            </span>
          </div>
          <div className={s.quadroIframe}>
            <iframe
              src={`/demos/${slug}`}
              title={`Prévia navegável do modelo ${nome}`}
              loading="lazy"
              onLoad={() => setCarregou(true)}
            />
          </div>
          {!carregou && <div className={s.veu}>Carregando a demo</div>}
        </>
      )}
    </div>
  );
}

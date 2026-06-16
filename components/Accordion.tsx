"use client";

// Accordion acessível: aria-expanded no botão; a ALTURA é do Motion
// (spring sem bounce, height auto) e o ÍCONE é do GSAP (MorphSVG: o traço
// vertical do "mais" deita e vira traço único). Donos distintos por nó,
// conforme a doutrina do registro.

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { m } from "motion/react";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

export type ItemAccordion = { pergunta: string; resposta: string };

const TRACO_V = "M8 2 L8 14";
const TRACO_H = "M2 8 L14 8";

function MaisMorph({ ativo }: { ativo: boolean }) {
  const ref = useRef<SVGPathElement>(null);
  const primeira = useRef(true);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(alvo, {
      morphSVG: ativo ? TRACO_H : TRACO_V,
      duration: reduzido ? 0 : 0.45,
      ease: "andrade",
    });
  }, [ativo]);

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d={TRACO_H} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path ref={ref} d={TRACO_V} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Accordion({ itens }: { itens: ItemAccordion[] }) {
  const [aberto, setAberto] = useState<number | null>(null);
  const base = useId();

  return (
    <div>
      {itens.map((item, i) => {
        const ativo = aberto === i;
        return (
          <div className="acc-item" key={item.pergunta}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="acc-botao"
                aria-expanded={ativo}
                aria-controls={`${base}-p${i}`}
                id={`${base}-b${i}`}
                data-cursor="LER"
                onClick={() => setAberto(ativo ? null : i)}
              >
                {item.pergunta}
                <MaisMorph ativo={ativo} />
              </button>
            </h3>
            <m.div
              className="acc-painel"
              role="region"
              id={`${base}-p${i}`}
              aria-labelledby={`${base}-b${i}`}
              initial={false}
              animate={{ height: ativo ? "auto" : 0 }}
              transition={{ type: "spring", visualDuration: 0.6, bounce: 0 }}
            >
              <p>{item.resposta}</p>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}

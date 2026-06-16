"use client";

// Rail lateral: dots e nome da seção ativa. A medição é manual via
// getBoundingClientRect no scroll, porque ScrollTriggers criados antes de um
// pin não recebem o offset do espaçador.

import { useEffect, useState } from "react";
import { useLenis } from "@/components/LenisProvider";

const SECOES = [
  { id: "cap-abertura", nome: "Início" },
  { id: "cap-caminhos", nome: "Soluções" },
  { id: "cap-modelos", nome: "Projetos" },
  { id: "cap-diagnostico", nome: "Diagnóstico" },
  { id: "cap-estudio", nome: "Estúdio" },
  { id: "cap-bastidores", nome: "Bastidores" },
  { id: "cap-investimento", nome: "Investimento" },
  { id: "cap-final", nome: "Contato" },
];

export default function RailSecoes() {
  const [ativa, setAtiva] = useState(0);
  const { irPara } = useLenis();

  useEffect(() => {
    let agendado = false;
    const medir = () => {
      agendado = false;
      const meio = window.innerHeight * 0.5;
      let atual = 0;
      SECOES.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= meio) atual = i;
      });
      setAtiva(atual);
    };
    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <nav className="rail" aria-label="Seções da página">
      {SECOES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-current={i === ativa}
          aria-label={s.nome}
          data-num={`0${i + 1}`}
          onClick={() => irPara(`#${s.id}`)}
        />
      ))}
    </nav>
  );
}

"use client";

// Faixa honesta "estúdio ao vivo": ponto pulsante, hora local de Sumaré em
// tempo real (Intl, America/Sao_Paulo; tick de 30s SOMENTE com a faixa no
// viewport), estado derivado da hora (em atividade / em repouso) e a agenda
// do mês vinda exclusivamente de lib/disponibilidade.ts. Antes da hidratação
// a célula da hora fica vazia (nunca hora do servidor). aria-live off: o
// rótulo completo vive no aria-label.

import { useEffect, useRef, useState } from "react";
import { DISPONIBILIDADE, ROTULO_AGENDA } from "@/lib/disponibilidade";

const FORMATO = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
});

function estadoDoEstudio(agora: Date): string {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    weekday: "short",
    hour12: false,
  }).formatToParts(agora);
  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? "0");
  const dia = partes.find((p) => p.type === "weekday")?.value ?? "";
  const fimDeSemana = dia.startsWith("sáb") || dia.startsWith("dom");
  if (!fimDeSemana && hora >= 9 && hora < 18) return "estúdio em atividade";
  return "em repouso, resposta no próximo dia útil";
}

export default function EstudioAoVivo({ className }: { className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [estado, setEstado] = useState("");

  useEffect(() => {
    let timer: number | null = null;
    const tique = () => {
      const agora = new Date();
      setHora(FORMATO.format(agora));
      setEstado(estadoDoEstudio(agora));
    };
    const ligar = () => {
      if (timer !== null) return;
      tique();
      timer = window.setInterval(tique, 30000);
    };
    const desligar = () => {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    };
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? ligar() : desligar(),
    );
    io.observe(el);
    return () => {
      io.disconnect();
      desligar();
    };
  }, []);

  const agenda = ROTULO_AGENDA[DISPONIBILIDADE.agendaDoMes];

  return (
    <p
      className={`aovivo ${className ?? ""}`}
      ref={ref}
      role="status"
      aria-live="off"
      aria-label={`Sumaré SP, ${hora ?? ""} ${estado}, ${agenda}, ${DISPONIBILIDADE.slaResposta}`}
    >
      <span className="aovivo-ponto" aria-hidden="true" />
      <span className="aovivo-celula">Sumaré, SP</span>
      <span className="aovivo-celula" aria-hidden={hora === null}>
        {hora === null ? "" : `${hora} · ${estado}`}
      </span>
      <span className="aovivo-celula">{agenda}</span>
      <span className="aovivo-celula">{DISPONIBILIDADE.slaResposta}</span>
    </p>
  );
}

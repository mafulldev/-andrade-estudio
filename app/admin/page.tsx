"use client";

// Dashboard: os últimos 30 dias em linhas editoriais, com o funil real
// calculado da tabela de eventos.

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { useAdmin } from "@/components/admin/useAdmin";
import { ROTULO_SEGMENTO } from "@/lib/rotulos";
import s from "./admin.module.css";

type Resumo = {
  totais: { leads: number; identificados: number };
  porTemperatura: Record<string, number>;
  porSegmento: Record<string, number>;
  porStatus: Record<string, number>;
  funil: { iniciaram: number; concluiram: number; whatsapp: number };
};

function Linha({
  rotulo,
  valor,
  proporcao,
}: {
  rotulo: string;
  valor: number | string;
  proporcao?: number;
}) {
  return (
    <div className={s.linhaMetrica}>
      <span className="label">{rotulo}</span>
      {proporcao !== undefined ? (
        <span className={s.barraProporcao}>
          <span style={{ transform: `scaleX(${Math.min(Math.max(proporcao, 0), 1)})` }} />
        </span>
      ) : (
        <span />
      )}
      <span className={s.metricaValor}>{valor}</span>
    </div>
  );
}

export default function PaginaDashboard() {
  const { token, carregando, autorizado } = useAdmin();
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/resumo", { headers: autorizado() })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Resumo & { ok: boolean }>;
      })
      .then(setResumo)
      .catch(() => setErro("Não foi possível carregar o resumo."));
  }, [token, autorizado]);

  const f = resumo?.funil;
  const base = f && f.iniciaram > 0 ? f.iniciaram : 0;

  return (
    <div className={s.casca}>
      <AdminNav />
      <main id="conteudo" className={s.conteudo}>
        <div>
          <span className="label">Últimos 30 dias</span>
          <h1 className={s.tituloPagina}>Dashboard</h1>
        </div>

        {carregando && <p className="mudo">Carregando.</p>}
        {erro && <p className="mudo">{erro}</p>}

        {resumo && (
          <>
            <section className={`${s.bloco} ${s.blocoCartao}`} aria-label="Totais">
              <span className="label">Totais</span>
              <div>
                <Linha rotulo="Leads no período" valor={resumo.totais.leads} />
                <Linha
                  rotulo="Identificados"
                  valor={resumo.totais.identificados}
                  proporcao={
                    resumo.totais.leads
                      ? resumo.totais.identificados / resumo.totais.leads
                      : 0
                  }
                />
              </div>
            </section>

            <section className={`${s.bloco} ${s.blocoCartao}`} aria-label="Temperatura">
              <span className="label">Por temperatura</span>
              <div>
                {(["quente", "morno", "frio"] as const).map((t) => (
                  <Linha
                    key={t}
                    rotulo={t}
                    valor={resumo.porTemperatura[t] ?? 0}
                    proporcao={
                      resumo.totais.leads
                        ? (resumo.porTemperatura[t] ?? 0) / resumo.totais.leads
                        : 0
                    }
                  />
                ))}
              </div>
            </section>

            <section className={`${s.bloco} ${s.blocoCartao}`} aria-label="Nichos">
              <span className="label">Por nicho</span>
              <div>
                {Object.entries(resumo.porSegmento)
                  .sort((a, b) => b[1] - a[1])
                  .map(([seg, n]) => (
                    <Linha
                      key={seg}
                      rotulo={
                        ROTULO_SEGMENTO[seg as keyof typeof ROTULO_SEGMENTO] ??
                        "Não informado"
                      }
                      valor={n}
                      proporcao={resumo.totais.leads ? n / resumo.totais.leads : 0}
                    />
                  ))}
                {Object.keys(resumo.porSegmento).length === 0 && (
                  <p className={s.vazio}>Sem leads no período.</p>
                )}
              </div>
            </section>

            <section className={`${s.bloco} ${s.blocoCartao}`} aria-label="Funil">
              <span className="label">Funil do diagnóstico</span>
              <div>
                <Linha rotulo="Iniciaram" valor={f?.iniciaram ?? 0} proporcao={base ? 1 : 0} />
                <Linha
                  rotulo="Concluíram"
                  valor={f?.concluiram ?? 0}
                  proporcao={base ? (f?.concluiram ?? 0) / base : 0}
                />
                <Linha
                  rotulo="Clicaram WhatsApp"
                  valor={f?.whatsapp ?? 0}
                  proporcao={base ? (f?.whatsapp ?? 0) / base : 0}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

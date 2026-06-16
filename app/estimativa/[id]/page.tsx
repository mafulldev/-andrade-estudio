// Estimativa pública permanente, lida do banco no servidor.
// NUNCA exibe contato: apenas o primeiro nome, se houver.
// Fora do índice de busca; id inexistente cai no not-found.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AcoesEstimativa from "@/components/diagnostico/AcoesEstimativa";
import { supabaseAdmin } from "@/lib/supabase";
import { DISCLAIMER, type Caminho } from "@/lib/motor";
import {
  dataPorExtenso,
  faixaPorExtenso,
  ROTULO_CAMINHO,
  ROTULO_FUNC,
  ROTULO_INVEST,
  ROTULO_OBJETIVO,
  ROTULO_PRAZO,
  ROTULO_SEGMENTO,
} from "@/lib/rotulos";
import s from "./estimativa.module.css";

export const metadata: Metadata = {
  title: "Estimativa",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WHATSAPP_NUMERO = "5519971460099";

type Lead = {
  id: string;
  numero: number | null;
  created_at: string;
  nome: string | null;
  segmento: string | null;
  objetivo: string | null;
  funcionalidades: string[] | null;
  prazo: string | null;
  investimento: string | null;
  caminho: Caminho | null;
  faixa_min: number | null;
  faixa_max: number | null;
  prazo_estimado: string | null;
};

function rotuloOuCru<T extends string>(mapa: Record<string, string>, v: T | null) {
  if (!v) return null;
  return mapa[v] ?? v;
}

export default async function PaginaEstimativa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const sb = supabaseAdmin();
  if (!sb) notFound();

  const { data, error } = await sb
    .from("leads")
    .select(
      "id, numero, created_at, nome, segmento, objetivo, funcionalidades, prazo, investimento, caminho, faixa_min, faixa_max, prazo_estimado",
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  const lead = data as Lead;
  if (!lead.caminho || lead.faixa_min === null || lead.faixa_max === null) notFound();

  const primeiroNome = lead.nome ? lead.nome.trim().split(/\s+/)[0] : null;
  const funcionalidades = Array.isArray(lead.funcionalidades)
    ? lead.funcionalidades.map((f) => ROTULO_FUNC[f as keyof typeof ROTULO_FUNC] ?? f)
    : [];
  const faixa = faixaPorExtenso(lead.faixa_min, lead.faixa_max);

  const msg =
    `Olá, Matheus. ${primeiroNome ? `Sou ${primeiroNome}. ` : ""}` +
    `Diagnóstico Nº ${lead.numero ?? "recente"}: ` +
    `segmento ${rotuloOuCru(ROTULO_SEGMENTO, lead.segmento) ?? "não informado"}, ` +
    `objetivo ${rotuloOuCru(ROTULO_OBJETIVO, lead.objetivo) ?? "não informado"}, ` +
    `funcionalidades ${funcionalidades.length ? funcionalidades.join(", ") : "nenhuma específica"}, ` +
    `prazo ${rotuloOuCru(ROTULO_PRAZO, lead.prazo) ?? "não informado"}. ` +
    `Estimativa apresentada: ${faixa}. Quero receber a proposta detalhada.`;
  const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;

  const briefing: [string, string][] = [
    ["Para", primeiroNome ?? "Visitante do site"],
    ["Segmento", rotuloOuCru(ROTULO_SEGMENTO, lead.segmento) ?? "Não informado"],
    ["Objetivo", rotuloOuCru(ROTULO_OBJETIVO, lead.objetivo) ?? "Não informado"],
    [
      "Funcionalidades",
      funcionalidades.length ? funcionalidades.join(", ") : "Nenhuma específica",
    ],
    ["Prazo desejado", rotuloOuCru(ROTULO_PRAZO, lead.prazo) ?? "Não informado"],
    [
      "Investimento declarado",
      rotuloOuCru(ROTULO_INVEST, lead.investimento) ?? "Não informado",
    ],
  ];

  return (
    <div className={s.pagina}>
      <Header />

      <main id="conteudo" className={s.doc}>
        <article className={s.docCartao}>
          <div className={s.cabecalho}>
            <span className="label">
              ANDRADE, Estúdio digital · {dataPorExtenso(new Date(lead.created_at))}
            </span>
            {lead.numero !== null && (
              <span className={s.numero}>Diagnóstico Nº {lead.numero}</span>
            )}
          </div>

          <div className={s.bloco}>
            <span className="label">Caminho recomendado</span>
            <h1 className={s.caminho}>{ROTULO_CAMINHO[lead.caminho]}</h1>
          </div>

          <div className={s.bloco}>
            <span className="label">Briefing técnico</span>
            <div className={s.linhas}>
              {briefing.map(([rotulo, valor]) => (
                <div className={s.linhaItem} key={rotulo}>
                  <span className="label">{rotulo}</span>
                  <span>{valor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={s.bloco}>
            <span className="label">Investimento estimado</span>
            <p className={s.faixa}>{faixa}</p>
            <p className={s.disclaimer}>{DISCLAIMER}</p>
          </div>

          <div className={s.bloco}>
            <span className="label">Prazo estimado</span>
            <p>{lead.prazo_estimado}</p>
          </div>
        </article>

        <div className={s.acoes}>
          <AcoesEstimativa linkWhatsApp={linkWhatsApp} leadId={lead.id} />
        </div>
      </main>
    </div>
  );
}

"use client";

// Leads: a mesa de trabalho do CRM. Filtros por status, temperatura e
// segmento, busca por nome, ordenação por data e score, painel lateral com
// briefing completo, eventos, status, notas e handoff de WhatsApp.
// Exportação CSV gerada no cliente, sobre a lista filtrada.

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { useAdmin } from "@/components/admin/useAdmin";
import { mostrarToast } from "@/components/Toast";
import { BotaoLinha } from "@/components/Botoes";
import { IcoFechar, IcoSetaDiagonal } from "@/components/Icones";
import { STATUS_LEAD, type EventoRegistro, type LeadRegistro, type StatusLead } from "@/lib/tipos";
import {
  faixaPorExtenso,
  ROTULO_CAMINHO,
  ROTULO_FUNC,
  ROTULO_INVEST,
  ROTULO_OBJETIVO,
  ROTULO_PRAZO,
  ROTULO_SEGMENTO,
} from "@/lib/rotulos";
import s from "@/app/admin/admin.module.css";

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });

const horaCurta = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

function rotular(mapa: Record<string, string>, v: string | null): string {
  if (!v) return "Não informado";
  return mapa[v] ?? v;
}

function csvCelula(v: unknown): string {
  const texto = v === null || v === undefined ? "" : String(v);
  return `"${texto.replace(/"/g, '""')}"`;
}

function exportarCsv(leads: LeadRegistro[]) {
  const colunas = [
    "numero", "created_at", "nome", "contato_tipo", "contato", "segmento",
    "objetivo", "funcionalidades", "prazo", "investimento", "caminho",
    "faixa_min", "faixa_max", "score", "temperatura", "status",
    "consentimento", "origem", "notas",
  ];
  const linhas = leads.map((l) =>
    colunas
      .map((c) => {
        const valor = l[c as keyof LeadRegistro];
        return csvCelula(Array.isArray(valor) ? valor.join("; ") : valor);
      })
      .join(","),
  );
  const conteudo = "﻿" + [colunas.join(","), ...linhas].join("\r\n");
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-andrade-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function linkWhatsLead(l: LeadRegistro): string | null {
  if (l.contato_tipo !== "whatsapp" || !l.contato) return null;
  const numero = l.contato.replace(/\D/g, "");
  if (numero.length < 10) return null;
  const ddi = numero.startsWith("55") ? numero : `55${numero}`;
  const primeiro = l.nome?.trim().split(/\s+/)[0];
  const msg =
    `Olá${primeiro ? `, ${primeiro}` : ""}. Aqui é o Matheus, do ANDRADE. ` +
    `Recebi seu diagnóstico${l.numero ? ` Nº ${l.numero}` : ""}` +
    (l.faixa_min !== null && l.faixa_max !== null
      ? ` com estimativa de ${faixaPorExtenso(l.faixa_min, l.faixa_max)}`
      : "") +
    `. Posso te enviar a proposta detalhada?`;
  return `https://wa.me/${ddi}?text=${encodeURIComponent(msg)}`;
}

export default function PaginaLeads() {
  const { token, carregando, autorizado } = useAdmin();
  const [leads, setLeads] = useState<LeadRegistro[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [fStatus, setFStatus] = useState("todos");
  const [fTemp, setFTemp] = useState("todas");
  const [fSeg, setFSeg] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"data" | "score">("data");
  const [aberto, setAberto] = useState<LeadRegistro | null>(null);
  const [eventos, setEventos] = useState<EventoRegistro[]>([]);
  const [notas, setNotas] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/leads", { headers: autorizado() })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<{ leads: LeadRegistro[] }>;
      })
      .then((d) => setLeads(d.leads))
      .catch(() => setErro("Não foi possível carregar os leads."));
  }, [token, autorizado]);

  useEffect(() => {
    if (!aberto || !token) return;
    setNotas(aberto.notas ?? "");
    setEventos([]);
    fetch(`/api/admin/eventos?lead_id=${aberto.id}`, { headers: autorizado() })
      .then((r) => (r.ok ? r.json() : { eventos: [] }))
      .then((d: { eventos: EventoRegistro[] }) => setEventos(d.eventos))
      .catch(() => {});
  }, [aberto, token, autorizado]);

  const filtrados = useMemo(() => {
    let lista = leads;
    if (fStatus !== "todos") lista = lista.filter((l) => l.status === fStatus);
    if (fTemp !== "todas") lista = lista.filter((l) => l.temperatura === fTemp);
    if (fSeg !== "todos") lista = lista.filter((l) => l.segmento === fSeg);
    if (busca.trim()) {
      const b = busca.trim().toLowerCase();
      lista = lista.filter((l) => (l.nome ?? "").toLowerCase().includes(b));
    }
    return [...lista].sort((a, b) =>
      ordem === "score"
        ? (b.score ?? 0) - (a.score ?? 0)
        : b.created_at.localeCompare(a.created_at),
    );
  }, [leads, fStatus, fTemp, fSeg, busca, ordem]);

  const atualizar = async (mudancas: { status?: StatusLead; notas?: string }) => {
    if (!aberto || salvando) return;
    setSalvando(true);
    const r = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: autorizado({ "content-type": "application/json" }),
      body: JSON.stringify({ id: aberto.id, ...mudancas }),
    });
    setSalvando(false);
    if (!r.ok) {
      mostrarToast("Não foi possível salvar.");
      return;
    }
    const atualizadoParcial = mudancas;
    setLeads((ls) =>
      ls.map((l) => (l.id === aberto.id ? { ...l, ...atualizadoParcial } : l)),
    );
    setAberto((a) => (a ? { ...a, ...atualizadoParcial } : a));
    mostrarToast("Salvo.");
  };

  const classeTemp = (t: string | null) =>
    t === "quente" ? s.tempQuente : t === "morno" ? s.tempMorno : "";

  return (
    <div className={s.casca}>
      <AdminNav />
      <main id="conteudo" className={s.conteudo}>
        <div>
          <span className="label">{filtrados.length} de {leads.length}</span>
          <h1 className={s.tituloPagina}>Leads</h1>
        </div>

        {carregando && <p className="mudo">Carregando.</p>}
        {erro && <p className="mudo">{erro}</p>}

        <div className={s.filtros}>
          <select className={s.seletor} value={fStatus} onChange={(e) => setFStatus(e.target.value)} aria-label="Filtrar por status">
            <option value="todos">Todos os status</option>
            {STATUS_LEAD.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <select className={s.seletor} value={fTemp} onChange={(e) => setFTemp(e.target.value)} aria-label="Filtrar por temperatura">
            <option value="todas">Todas as temperaturas</option>
            <option value="quente">quente</option>
            <option value="morno">morno</option>
            <option value="frio">frio</option>
          </select>
          <select className={s.seletor} value={fSeg} onChange={(e) => setFSeg(e.target.value)} aria-label="Filtrar por segmento">
            <option value="todos">Todos os segmentos</option>
            {Object.entries(ROTULO_SEGMENTO).map(([v, r]) => (
              <option key={v} value={v}>{r}</option>
            ))}
          </select>
          <input
            className={s.busca}
            type="search"
            placeholder="Buscar por nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar por nome"
          />
          <BotaoLinha onClick={() => exportarCsv(filtrados)}>Exportar CSV</BotaoLinha>
        </div>

        <div className={s.tabelaWrap}>
          <table className={s.tabela}>
            <thead>
              <tr>
                <th>
                  <button type="button" data-ativo={ordem === "data"} onClick={() => setOrdem("data")}>
                    Data
                  </button>
                </th>
                <th><span className="label">Lead</span></th>
                <th><span className="label">Segmento</span></th>
                <th><span className="label">Temperatura</span></th>
                <th>
                  <button type="button" data-ativo={ordem === "score"} onClick={() => setOrdem("score")}>
                    Score
                  </button>
                </th>
                <th><span className="label">Faixa</span></th>
                <th><span className="label">Status</span></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((l) => (
                <tr key={l.id} className={s.linhaLead} onClick={() => setAberto(l)}>
                  <td>{dataCurta(l.created_at)}</td>
                  <td>{l.nome ?? "Anônimo"}</td>
                  <td>{rotular(ROTULO_SEGMENTO, l.segmento)}</td>
                  <td>
                    <span className={`${s.temperatura} ${classeTemp(l.temperatura)}`}>
                      <span className={s.tempDot} />
                      {l.temperatura ?? "frio"}
                    </span>
                  </td>
                  <td>{l.score ?? 0}</td>
                  <td>
                    {l.faixa_min !== null && l.faixa_max !== null
                      ? faixaPorExtenso(l.faixa_min, l.faixa_max)
                      : "Sem faixa"}
                  </td>
                  <td><span className={s.statusEtiqueta}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!carregando && filtrados.length === 0 && (
            <p className={s.vazio}>Nenhum lead com estes filtros.</p>
          )}
        </div>
      </main>

      {aberto && (
        <>
          <div className={s.painelFundo} onClick={() => setAberto(null)} aria-hidden="true" />
          <aside
            className={s.painel}
            aria-label={`Detalhe do lead ${aberto.nome ?? "anônimo"}`}
            data-lenis-prevent
          >
            <div className={s.painelTopo}>
              <div>
                <span className="label">
                  {aberto.numero ? `Diagnóstico Nº ${aberto.numero} · ` : ""}
                  {horaCurta(aberto.created_at)}
                </span>
                <p className={s.painelNome}>{aberto.nome ?? "Anônimo"}</p>
              </div>
              <button type="button" onClick={() => setAberto(null)} aria-label="Fechar painel">
                <IcoFechar size={18} />
              </button>
            </div>

            <div>
              {([
                ["Contato", aberto.contato ? `${aberto.contato} (${aberto.contato_tipo})` : "Não informado"],
                ["Consentimento", aberto.consentimento ? "Sim" : "Não"],
                ["Segmento", rotular(ROTULO_SEGMENTO, aberto.segmento)],
                ["Objetivo", rotular(ROTULO_OBJETIVO, aberto.objetivo)],
                [
                  "Funcionalidades",
                  aberto.funcionalidades?.length
                    ? aberto.funcionalidades.map((f) => ROTULO_FUNC[f as keyof typeof ROTULO_FUNC] ?? f).join(", ")
                    : "Nenhuma específica",
                ],
                ["Prazo", rotular(ROTULO_PRAZO, aberto.prazo)],
                ["Investimento", rotular(ROTULO_INVEST, aberto.investimento)],
                ["Caminho", aberto.caminho ? ROTULO_CAMINHO[aberto.caminho] : "Não calculado"],
                [
                  "Faixa",
                  aberto.faixa_min !== null && aberto.faixa_max !== null
                    ? `${faixaPorExtenso(aberto.faixa_min, aberto.faixa_max)} · ${aberto.prazo_estimado ?? ""}`
                    : "Sem faixa",
                ],
                ["Origem", aberto.origem ?? "Não informada"],
              ] as [string, string][]).map(([r, v]) => (
                <div className={s.parDado} key={r}>
                  <span className="label">{r}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <div className={s.bloco}>
              <label className="label" htmlFor="status-lead">Status</label>
              <select
                id="status-lead"
                className={s.seletor}
                value={aberto.status}
                onChange={(e) => atualizar({ status: e.target.value as StatusLead })}
              >
                {STATUS_LEAD.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className={s.bloco}>
              <label className="label" htmlFor="notas-lead">Notas</label>
              <textarea
                id="notas-lead"
                className={s.notas}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
              <BotaoLinha onClick={() => atualizar({ notas })}>
                {salvando ? "Salvando" : "Salvar notas"}
              </BotaoLinha>
            </div>

            <div className={s.acoesPainel}>
              {linkWhatsLead(aberto) && (
                <a
                  className="botao-linha"
                  href={linkWhatsLead(aberto)!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Abrir WhatsApp</span>
                  <IcoSetaDiagonal size={14} />
                </a>
              )}
              <a className="botao-linha" href={`/estimativa/${aberto.id}`} target="_blank" rel="noopener noreferrer">
                <span>Estimativa pública</span>
                <IcoSetaDiagonal size={14} />
              </a>
            </div>

            <div className={s.bloco}>
              <span className="label">Eventos do lead</span>
              <ul className={s.eventosLista}>
                {eventos.map((e) => (
                  <li key={e.id}>
                    <span>{e.tipo}</span>
                    <span>{horaCurta(e.created_at)}</span>
                  </li>
                ))}
                {eventos.length === 0 && <li><span>Sem eventos vinculados.</span></li>}
              </ul>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

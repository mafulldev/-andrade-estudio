// POST /api/lead — o coração da captação.
// acao "criar" (padrão): valida estritamente, recalcula o motor no servidor,
//   aplica honeypot + tempo mínimo + Turnstile, salva o lead (mesmo anônimo)
//   e dispara as automações (e-mail ao lead, notificação interna, Telegram).
// acao "email": envia a estimativa por e-mail para um lead existente,
//   gravando contato e consentimento quando fornecidos no resultado.

import { NextResponse, type NextRequest } from "next/server";
import { avaliar, type Funcionalidade, type Respostas } from "@/lib/motor";
import { pontuar } from "@/lib/scoring";
import { supabaseAdmin } from "@/lib/supabase";
import { validarTurnstile } from "@/lib/turnstile";
import { enviarEstimativaLead, enviarNotificacaoInterna } from "@/lib/emails";
import { notificarTelegram } from "@/lib/telegram";
import {
  faixaPorExtenso,
  ROTULO_OBJETIVO,
  ROTULO_SEGMENTO,
} from "@/lib/rotulos";

const SEGMENTOS = new Set([
  "restaurante", "saude", "advocacia", "servicos",
  "imobiliario", "loja", "startup", "outro",
]);
const OBJETIVOS = new Set(["vender", "contatos", "presenca", "agendamentos", "sistema"]);
const FUNCS = new Set([
  "pagamentos", "agendamento", "membros", "blogSeo",
  "multiIdioma", "integracoes", "admin",
]);
const PRAZOS_SET = new Set(["urgente", "2a4", "flexivel"]);
const INVESTIMENTOS = new Set([
  "ate2500", "2500a6000", "6000a15000", "acima15000", "verEstimativa",
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEMPO_MINIMO_MS = 4000;

function erroJson(status: number, mensagem: string) {
  return NextResponse.json({ ok: false, erro: mensagem }, { status });
}

function texto(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const limpo = v.trim().slice(0, max);
  return limpo.length > 0 ? limpo : null;
}

function validarRespostas(bruto: unknown): Respostas | null {
  if (typeof bruto !== "object" || bruto === null) return null;
  const r = bruto as Record<string, unknown>;
  if (typeof r.segmento !== "string" || !SEGMENTOS.has(r.segmento)) return null;
  if (typeof r.objetivo !== "string" || !OBJETIVOS.has(r.objetivo)) return null;
  if (typeof r.prazo !== "string" || !PRAZOS_SET.has(r.prazo)) return null;
  if (typeof r.invest !== "string" || !INVESTIMENTOS.has(r.invest)) return null;
  if (!Array.isArray(r.func) || r.func.length > 7) return null;
  const func: Funcionalidade[] = [];
  for (const f of r.func) {
    if (typeof f !== "string" || !FUNCS.has(f)) return null;
    if (!func.includes(f as Funcionalidade)) func.push(f as Funcionalidade);
  }
  return {
    segmento: r.segmento,
    objetivo: r.objetivo,
    func,
    prazo: r.prazo,
    invest: r.invest,
  } as Respostas;
}

function urlEstimativa(id: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base || !id) return null;
  return `${base.replace(/\/$/, "")}/estimativa/${id}`;
}

export async function POST(req: NextRequest) {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return erroJson(400, "Payload inválido.");
  }
  if (typeof corpo !== "object" || corpo === null) {
    return erroJson(400, "Payload inválido.");
  }
  const c = corpo as Record<string, unknown>;

  if (c.acao === "email") return acaoEmail(c);
  return acaoCriar(req, c);
}

async function acaoCriar(req: NextRequest, c: Record<string, unknown>) {
  // honeypot: campo oculto preenchido = robô; responde 200 sem fazer nada
  if (typeof c.website === "string" && c.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // tempo mínimo de preenchimento
  const duracao = typeof c.duracaoMs === "number" ? c.duracaoMs : 0;
  if (!Number.isFinite(duracao) || duracao < TEMPO_MINIMO_MS) {
    return erroJson(429, "Envio rápido demais. Tente novamente.");
  }

  const respostas = validarRespostas(c.respostas);
  if (!respostas) return erroJson(400, "Respostas inválidas.");

  const nome = texto(c.nome, 120);
  const contato = texto(c.contato, 200);
  const contatoTipo =
    c.contatoTipo === "whatsapp" || c.contatoTipo === "email"
      ? c.contatoTipo
      : null;
  const consentimento = c.consentimento === true;

  if (contato && !contatoTipo) return erroJson(400, "Tipo de contato inválido.");
  if (contato && contatoTipo === "email" && !EMAIL_RE.test(contato)) {
    return erroJson(400, "E-mail inválido.");
  }
  if (contato && !consentimento) {
    return erroJson(400, "O consentimento é necessário para receber contato.");
  }

  // Turnstile (pulado com aviso quando o env não existe)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const token = typeof c.turnstileToken === "string" ? c.turnstileToken : null;
  const humano = await validarTurnstile(token, ip);
  if (!humano) return erroJson(403, "Verificação anti-spam falhou.");

  // o motor roda no servidor: o cliente nunca dita números
  const aval = avaliar(respostas);
  const { score, temperatura } = pontuar(respostas, aval.caminho, !!contato);

  let id: string | null = null;
  let numero: number | null = null;
  let criadoEm = new Date().toISOString();

  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("leads")
      .insert({
        nome,
        contato_tipo: contato ? contatoTipo : null,
        contato,
        segmento: respostas.segmento,
        objetivo: respostas.objetivo,
        funcionalidades: respostas.func,
        prazo: respostas.prazo,
        investimento: respostas.invest,
        caminho: aval.caminho,
        categoria: aval.categoria,
        faixa_min: aval.faixaMin,
        faixa_max: aval.faixaMax,
        prazo_estimado: aval.prazoEstimado,
        score,
        temperatura,
        consentimento,
        origem: texto(c.origem, 60) ?? "diagnostico",
      })
      .select("id, numero, created_at")
      .single();

    if (error) {
      console.log("[lead] falha ao salvar:", error.message);
    } else if (data) {
      id = data.id as string;
      numero = data.numero as number;
      criadoEm = data.created_at as string;
    }
  }

  // automações 3 e 4: e-mail ao lead (se houver e-mail), notificação interna
  // e Telegram. Falha de automação jamais derruba a resposta.
  const url = urlEstimativa(id);
  const resumoInterno = {
    numero,
    nome,
    contato,
    contatoTipo,
    segmento: ROTULO_SEGMENTO[respostas.segmento],
    objetivo: ROTULO_OBJETIVO[respostas.objetivo],
    caminho: aval.caminho,
    faixaMin: aval.faixaMin,
    faixaMax: aval.faixaMax,
    temperatura,
    score,
    urlEstimativa: url,
  };

  const tarefas: Promise<void>[] = [
    enviarNotificacaoInterna(resumoInterno),
    notificarTelegram(
      `Novo lead ${temperatura.toUpperCase()}${numero ? ` (Nº ${numero})` : ""}\n` +
        `${nome ?? "Anônimo"} · ${ROTULO_SEGMENTO[respostas.segmento]}\n` +
        `${faixaPorExtenso(aval.faixaMin, aval.faixaMax)} · score ${score}` +
        (contato ? `\nContato: ${contato} (${contatoTipo})` : ""),
    ),
  ];
  if (contato && contatoTipo === "email") {
    tarefas.push(
      enviarEstimativaLead({
        para: contato,
        nome,
        numero,
        caminho: aval.caminho,
        faixaMin: aval.faixaMin,
        faixaMax: aval.faixaMax,
        prazoEstimado: aval.prazoEstimado,
        url,
      }),
    );
  }
  await Promise.allSettled(tarefas);

  return NextResponse.json({
    ok: true,
    id,
    numero,
    criadoEm,
    caminho: aval.caminho,
    categoria: aval.categoria,
    faixaMin: aval.faixaMin,
    faixaMax: aval.faixaMax,
    prazoEstimado: aval.prazoEstimado,
  });
}

async function acaoEmail(c: Record<string, unknown>) {
  const id = typeof c.id === "string" && UUID.test(c.id) ? c.id : null;
  if (!id) return erroJson(400, "Identificador inválido.");

  const sb = supabaseAdmin();
  if (!sb) return erroJson(503, "Envio indisponível no momento.");

  const { data: lead, error } = await sb
    .from("leads")
    .select(
      "id, numero, nome, contato, contato_tipo, consentimento, caminho, faixa_min, faixa_max, prazo_estimado",
    )
    .eq("id", id)
    .single();
  if (error || !lead) return erroJson(404, "Estimativa não encontrada.");

  const emailNovo = texto(c.email, 200);
  let destino = lead.contato_tipo === "email" ? (lead.contato as string) : null;

  if (emailNovo) {
    if (!EMAIL_RE.test(emailNovo)) return erroJson(400, "E-mail inválido.");
    if (c.consentimento !== true) {
      return erroJson(400, "O consentimento é necessário para receber o e-mail.");
    }
    destino = emailNovo;
    if (!lead.contato) {
      await sb
        .from("leads")
        .update({ contato: emailNovo, contato_tipo: "email", consentimento: true })
        .eq("id", id);
    }
  }

  if (!destino) return erroJson(400, "Informe um e-mail para receber a estimativa.");

  await enviarEstimativaLead({
    para: destino,
    nome: lead.nome as string | null,
    numero: lead.numero as number | null,
    caminho: lead.caminho as "pronto" | "sobmedida",
    faixaMin: lead.faixa_min as number,
    faixaMax: lead.faixa_max as number,
    prazoEstimado: lead.prazo_estimado as string,
    url: urlEstimativa(id),
  });

  return NextResponse.json({ ok: true });
}

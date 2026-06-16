// Cron diário (12h UTC, vercel.json) protegido por CRON_SECRET.
// 1. Keep-alive do Supabase: um select trivial impede a pausa do free tier.
// 2. Follow-up único de 48h: leads com status novo, e-mail presente,
//    consentimento true e followup_enviado_em nulo recebem UMA mensagem.
//    O campo é carimbado ANTES do envio para nunca repetir.

import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { enviarFollowUpLead } from "@/lib/emails";

// margem sob o limite diário de 100 e-mails da Resend
const LOTE_MAXIMO = 80;

function urlEstimativa(id: string): string | null {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return base ? `${base.replace(/\/$/, "")}/estimativa/${id}` : null;
}

export async function GET(req: NextRequest) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) {
    return NextResponse.json(
      { ok: false, erro: "CRON_SECRET não configurado." },
      { status: 503 },
    );
  }
  if (req.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false, erro: "Não autorizado." }, { status: 401 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ ok: true, banco: false, followups: 0 });
  }

  // keep-alive: atividade real no banco todos os dias
  const { error: erroKeepAlive } = await sb
    .from("leads")
    .select("id", { count: "exact", head: true });
  if (erroKeepAlive) console.log("[cron diario] keep-alive falhou:", erroKeepAlive.message);

  // follow-up de 48h
  const corte = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  const { data: pendentes, error } = await sb
    .from("leads")
    .select("id, numero, nome, contato")
    .eq("status", "novo")
    .eq("contato_tipo", "email")
    .eq("consentimento", true)
    .is("followup_enviado_em", null)
    .not("contato", "is", null)
    .lte("created_at", corte)
    .order("created_at", { ascending: true })
    .limit(LOTE_MAXIMO);

  if (error) {
    console.log("[cron diario] consulta falhou:", error.message);
    return NextResponse.json({ ok: false, erro: "Consulta falhou." }, { status: 500 });
  }

  let enviados = 0;
  for (const lead of pendentes ?? []) {
    // carimbo primeiro: o "nunca repetir" vale mais que um envio perdido
    const { data: carimbado } = await sb
      .from("leads")
      .update({ followup_enviado_em: new Date().toISOString() })
      .eq("id", lead.id)
      .is("followup_enviado_em", null)
      .select("id")
      .single();
    if (!carimbado) continue;

    const enviou = await enviarFollowUpLead({
      para: lead.contato as string,
      nome: lead.nome as string | null,
      numero: lead.numero as number | null,
      url: urlEstimativa(lead.id as string),
    });
    if (enviou) enviados += 1;
  }

  return NextResponse.json({
    ok: true,
    banco: true,
    pendentes: pendentes?.length ?? 0,
    followups: enviados,
  });
}

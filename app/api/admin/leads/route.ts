// GET /api/admin/leads — lista completa para a tabela do CRM.
// PATCH /api/admin/leads — troca de status e notas, autenticadas pela
// sessão do admin. A service role jamais aparece no cliente.

import { NextResponse, type NextRequest } from "next/server";
import { autenticarAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { STATUS_LEAD, type StatusLead } from "@/lib/tipos";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const auth = await autenticarAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, erro: auth.mensagem }, { status: auth.status });
  }
  const sb = supabaseAdmin()!;
  const { data, error } = await sb
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    return NextResponse.json({ ok: false, erro: "Falha ao consultar leads." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, leads: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const auth = await autenticarAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, erro: auth.mensagem }, { status: auth.status });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "Payload inválido." }, { status: 400 });
  }
  const c = (corpo ?? {}) as Record<string, unknown>;

  const id = typeof c.id === "string" && UUID.test(c.id) ? c.id : null;
  if (!id) {
    return NextResponse.json({ ok: false, erro: "Identificador inválido." }, { status: 400 });
  }

  const mudancas: { status?: StatusLead; notas?: string } = {};
  if (c.status !== undefined) {
    if (typeof c.status !== "string" || !(STATUS_LEAD as readonly string[]).includes(c.status)) {
      return NextResponse.json({ ok: false, erro: "Status inválido." }, { status: 400 });
    }
    mudancas.status = c.status as StatusLead;
  }
  if (c.notas !== undefined) {
    if (typeof c.notas !== "string" || c.notas.length > 4000) {
      return NextResponse.json({ ok: false, erro: "Notas inválidas." }, { status: 400 });
    }
    mudancas.notas = c.notas;
  }
  if (Object.keys(mudancas).length === 0) {
    return NextResponse.json({ ok: false, erro: "Nada para atualizar." }, { status: 400 });
  }

  const sb = supabaseAdmin()!;
  const { data, error } = await sb
    .from("leads")
    .update(mudancas)
    .eq("id", id)
    .select("id, status, notas")
    .single();
  if (error || !data) {
    return NextResponse.json({ ok: false, erro: "Falha ao atualizar." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lead: data });
}

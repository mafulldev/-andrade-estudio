// GET /api/admin/eventos?lead_id=... — eventos do funil de um lead.

import { NextResponse, type NextRequest } from "next/server";
import { autenticarAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const auth = await autenticarAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, erro: auth.mensagem }, { status: auth.status });
  }

  const leadId = req.nextUrl.searchParams.get("lead_id");
  if (!leadId || !UUID.test(leadId)) {
    return NextResponse.json({ ok: false, erro: "lead_id inválido." }, { status: 400 });
  }

  const sb = supabaseAdmin()!;
  const { data, error } = await sb
    .from("eventos")
    .select("id, created_at, tipo, pagina, meta")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    return NextResponse.json({ ok: false, erro: "Falha ao consultar eventos." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, eventos: data ?? [] });
}

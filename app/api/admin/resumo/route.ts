// GET /api/admin/resumo — os últimos 30 dias em números: totais,
// temperatura, nichos e o funil real calculado da tabela eventos.

import { NextResponse, type NextRequest } from "next/server";
import { autenticarAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const auth = await autenticarAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, erro: auth.mensagem }, { status: auth.status });
  }
  const sb = supabaseAdmin()!;
  const desde = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data: leads, error } = await sb
    .from("leads")
    .select("id, nome, contato, temperatura, segmento, status, created_at")
    .gte("created_at", desde)
    .limit(2000);
  if (error) {
    return NextResponse.json({ ok: false, erro: "Falha ao consultar leads." }, { status: 500 });
  }

  const contarEvento = async (tipo: string) => {
    const { count } = await sb
      .from("eventos")
      .select("id", { count: "exact", head: true })
      .eq("tipo", tipo)
      .gte("created_at", desde);
    return count ?? 0;
  };

  const [iniciaram, concluiram, whatsapp] = await Promise.all([
    contarEvento("diagnostico_iniciado"),
    contarEvento("resultado_gerado"),
    contarEvento("whatsapp_click"),
  ]);

  const porTemperatura: Record<string, number> = { quente: 0, morno: 0, frio: 0 };
  const porSegmento: Record<string, number> = {};
  const porStatus: Record<string, number> = {};
  let identificados = 0;

  for (const l of leads ?? []) {
    if (l.contato) identificados += 1;
    if (l.temperatura && l.temperatura in porTemperatura) {
      porTemperatura[l.temperatura] += 1;
    }
    const seg = l.segmento ?? "nao_informado";
    porSegmento[seg] = (porSegmento[seg] ?? 0) + 1;
    porStatus[l.status ?? "novo"] = (porStatus[l.status ?? "novo"] ?? 0) + 1;
  }

  return NextResponse.json({
    ok: true,
    periodoDias: 30,
    totais: { leads: leads?.length ?? 0, identificados },
    porTemperatura,
    porSegmento,
    porStatus,
    funil: { iniciaram, concluiram, whatsapp },
  });
}

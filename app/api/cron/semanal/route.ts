// Cron semanal (segunda, 11h UTC, vercel.json) protegido por CRON_SECRET.
// Digest da semana para o ADMIN_EMAIL: leads, funil, nichos e temperatura.

import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { enviarDigestSemanal } from "@/lib/emails";
import { faixaPorExtenso, ROTULO_SEGMENTO } from "@/lib/rotulos";

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
    return NextResponse.json({ ok: true, banco: false });
  }

  const fim = new Date();
  const inicio = new Date(fim.getTime() - 7 * 86400000);

  const { data: leads, error } = await sb
    .from("leads")
    .select("nome, contato, temperatura, segmento, faixa_min, faixa_max, score")
    .gte("created_at", inicio.toISOString())
    .limit(2000);
  if (error) {
    console.log("[cron semanal] consulta falhou:", error.message);
    return NextResponse.json({ ok: false, erro: "Consulta falhou." }, { status: 500 });
  }

  const contarEvento = async (tipo: string) => {
    const { count } = await sb
      .from("eventos")
      .select("id", { count: "exact", head: true })
      .eq("tipo", tipo)
      .gte("created_at", inicio.toISOString());
    return count ?? 0;
  };
  const [iniciaram, concluiram, whatsapp] = await Promise.all([
    contarEvento("diagnostico_iniciado"),
    contarEvento("resultado_gerado"),
    contarEvento("whatsapp_click"),
  ]);

  const porTemperatura: Record<string, number> = { quente: 0, morno: 0, frio: 0 };
  const porSegmento: Record<string, number> = {};
  let identificados = 0;
  for (const l of leads ?? []) {
    if (l.contato) identificados += 1;
    if (l.temperatura && l.temperatura in porTemperatura) porTemperatura[l.temperatura] += 1;
    const seg =
      ROTULO_SEGMENTO[(l.segmento ?? "") as keyof typeof ROTULO_SEGMENTO] ??
      "Não informado";
    porSegmento[seg] = (porSegmento[seg] ?? 0) + 1;
  }

  const destaques = [...(leads ?? [])]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5)
    .map((l) => ({
      nome: (l.nome as string | null) ?? "Anônimo",
      faixa:
        l.faixa_min !== null && l.faixa_max !== null
          ? faixaPorExtenso(l.faixa_min as number, l.faixa_max as number)
          : "Sem faixa",
      temperatura: (l.temperatura as string | null) ?? "frio",
    }));

  const dataCurta = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  await enviarDigestSemanal({
    inicio: dataCurta(inicio),
    fim: dataCurta(fim),
    totais: { leads: leads?.length ?? 0, identificados },
    porTemperatura,
    porSegmento: Object.entries(porSegmento).sort((a, b) => b[1] - a[1]),
    funil: { iniciaram, concluiram, whatsapp },
    destaques,
  });

  return NextResponse.json({ ok: true, banco: true, leads: leads?.length ?? 0 });
}

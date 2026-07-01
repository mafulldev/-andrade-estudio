// Funil de eventos próprio. Escrita exclusiva do servidor via service role
// (RLS sem policies para anon). Responde 204 sempre que possível: o funil
// jamais quebra a navegação e não vaza internals.

import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checarLimite } from "@/lib/ratelimit";
import { TIPOS_EVENTO } from "@/lib/eventos";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  // rate-limit por IP: eventos são frequentes, mas um flood enche a tabela
  // `eventos` no free tier. Acima do teto, descarta em silêncio (204).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (ip && !checarLimite(`evento:${ip}`, 120, 60_000)) {
    return new NextResponse(null, { status: 204 });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (typeof corpo !== "object" || corpo === null) {
    return new NextResponse(null, { status: 204 });
  }
  const c = corpo as Record<string, unknown>;

  const tipo = typeof c.tipo === "string" ? c.tipo : "";
  if (!(TIPOS_EVENTO as readonly string[]).includes(tipo)) {
    return new NextResponse(null, { status: 204 });
  }

  const pagina = typeof c.pagina === "string" ? c.pagina.slice(0, 200) : null;
  const meta =
    typeof c.meta === "object" && c.meta !== null && !Array.isArray(c.meta)
      ? (c.meta as Record<string, unknown>)
      : {};
  const leadId =
    typeof c.lead_id === "string" && UUID.test(c.lead_id) ? c.lead_id : null;

  const sb = supabaseAdmin();
  if (sb) {
    const { error } = await sb
      .from("eventos")
      .insert({ tipo, pagina, meta, lead_id: leadId });
    if (error) console.log("[evento] falha ao gravar:", error.message);
  }

  return new NextResponse(null, { status: 204 });
}

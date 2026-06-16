// Funil de eventos próprio: analytics que o dono possui, sem mensalidade.
// Helper de cliente; falha em silêncio para nunca afetar a navegação.

export const TIPOS_EVENTO = [
  "visita_home",
  "diagnostico_iniciado",
  "etapa_concluida",
  "resultado_gerado",
  "whatsapp_click",
  "email_click",
  "pdf_click",
  "link_copiado",
  "demo_view",
  "demo_quero_click",
] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];

export function trackEvento(
  tipo: TipoEvento,
  meta: Record<string, unknown> = {},
  leadId?: string,
) {
  if (typeof window === "undefined") return;
  try {
    const corpo = JSON.stringify({
      tipo,
      pagina: window.location.pathname,
      meta,
      lead_id: leadId ?? null,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/evento",
        new Blob([corpo], { type: "application/json" }),
      );
    } else {
      fetch("/api/evento", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: corpo,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // silencioso de propósito
  }
}

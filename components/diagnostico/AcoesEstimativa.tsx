"use client";

// Ações da estimativa pública: WhatsApp com template e impressão A4.

import { IcoImpressora, IcoSetaDireita } from "@/components/Icones";
import { trackEvento } from "@/lib/eventos";

export default function AcoesEstimativa({
  linkWhatsApp,
  leadId,
}: {
  linkWhatsApp: string;
  leadId: string;
}) {
  return (
    <>
      <a
        className="botao-linha"
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="ABRIR"
        onClick={() => trackEvento("whatsapp_click", { origem: "estimativa" }, leadId)}
      >
        <span>Receber proposta no WhatsApp</span>
        <IcoSetaDireita size={14} />
      </a>
      <button
        type="button"
        className="botao-linha"
        onClick={() => {
          trackEvento("pdf_click", { origem: "estimativa" }, leadId);
          window.print();
        }}
      >
        <span>Salvar em PDF</span>
        <IcoImpressora size={15} />
      </button>
    </>
  );
}

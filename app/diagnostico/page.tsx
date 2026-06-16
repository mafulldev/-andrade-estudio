import type { Metadata } from "next";
import Consultor from "@/components/diagnostico/Consultor";

export const metadata: Metadata = {
  title: "Diagnóstico",
  description:
    "Seis perguntas. Um caminho. O consultor do estúdio recomenda o formato certo, estima investimento e prazo na hora, e envia tudo no seu e-mail.",
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Diagnóstico ANDRADE",
  url: `${SITE.replace(/\/$/, "")}/diagnostico`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  provider: { "@type": "Organization", name: "ANDRADE, Estúdio digital" },
};

export default function PaginaDiagnostico() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Consultor />
    </>
  );
}

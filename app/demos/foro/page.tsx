import type { Metadata } from "next";
import ForoPagina from "@/components/demos/foro/ForoPagina";

// Demo sem JSON-LD de negócio: empresa fictícia marcada como real engana buscadores.
export const metadata: Metadata = {
  title: { absolute: "FORO, Advocacia" },
  description:
    "Advocacia de princípio em cinco áreas. Modelo de demonstração do ANDRADE, Estúdio digital.",
};

export default function PaginaForo() {
  return <ForoPagina />;
}

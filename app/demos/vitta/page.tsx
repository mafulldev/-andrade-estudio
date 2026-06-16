import type { Metadata } from "next";
import VittaPagina from "@/components/demos/vitta/VittaPagina";

// Demo sem JSON-LD de negócio: empresa fictícia marcada como real engana buscadores.
export const metadata: Metadata = {
  title: { absolute: "VITTA, Clínica integrada" },
  description:
    "Seis especialidades, um método de cuidado. Modelo de demonstração do ANDRADE, Estúdio digital.",
};

export default function PaginaVitta() {
  return <VittaPagina />;
}

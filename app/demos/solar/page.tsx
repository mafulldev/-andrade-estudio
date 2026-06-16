import type { Metadata } from "next";
import SolarPagina from "@/components/demos/solar/SolarPagina";

// Demo sem JSON-LD de negócio: empresa fictícia marcada como real engana buscadores.
export const metadata: Metadata = {
  title: { absolute: "SOLAR, Imobiliária" },
  description:
    "Uma coleção curta de casas escolhidas a dedo, com visita acompanhada. Modelo de demonstração do ANDRADE, Estúdio digital.",
};

export default function PaginaSolar() {
  return <SolarPagina />;
}

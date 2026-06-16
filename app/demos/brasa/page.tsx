import type { Metadata } from "next";
import BrasaPagina from "@/components/demos/brasa/BrasaPagina";

// Demo sem JSON-LD de negócio: empresa fictícia marcada como real engana buscadores.
export const metadata: Metadata = {
  title: { absolute: "BRASA, Cozinha de fogo" },
  description:
    "Menu degustação em oito tempos, assado em lenha de macieira. Modelo de demonstração do ANDRADE, Estúdio digital.",
};

export default function PaginaBrasa() {
  return <BrasaPagina />;
}

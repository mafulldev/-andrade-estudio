import type { Metadata } from "next";
import PrumoPagina from "@/components/demos/prumo/PrumoPagina";

// Demo sem JSON-LD de negócio: empresa fictícia marcada como real engana buscadores.
export const metadata: Metadata = {
  title: { absolute: "PRUMO, Serviços e reforma" },
  description:
    "Elétrica, hidráulica, pintura e reforma completa, com orçamento fechado e obra limpa. Modelo de demonstração do ANDRADE, Estúdio digital.",
};

export default function PaginaPrumo() {
  return <PrumoPagina />;
}

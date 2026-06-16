// PRUMO — layout próprio da demo: fontes e identidade escopadas na rota.

import { Archivo, Inter } from "next/font/google";
import BarraDemo from "@/components/demos/BarraDemo";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--fonte-prumo-titulo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--fonte-prumo-corpo",
  display: "swap",
});

export default function LayoutPrumo({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${archivo.variable} ${inter.variable}`} data-demo="true">
      {children}
      <BarraDemo marca="PRUMO" />
    </div>
  );
}

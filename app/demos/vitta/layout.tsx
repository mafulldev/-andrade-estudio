// VITTA — layout próprio da demo: fontes e identidade escopadas na rota.

import { Lora, Manrope } from "next/font/google";
import BarraDemo from "@/components/demos/BarraDemo";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--fonte-vitta-titulo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--fonte-vitta-corpo",
  display: "swap",
});

export default function LayoutVitta({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${lora.variable} ${manrope.variable}`} data-demo="true">
      {children}
      <BarraDemo marca="VITTA" />
    </div>
  );
}

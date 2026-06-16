// SOLAR — layout próprio da demo: fontes e identidade escopadas na rota.

import { Figtree, Marcellus } from "next/font/google";
import BarraDemo from "@/components/demos/BarraDemo";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--fonte-solar-titulo",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--fonte-solar-corpo",
  display: "swap",
});

export default function LayoutSolar({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${marcellus.variable} ${figtree.variable}`} data-demo="true">
      {children}
      <BarraDemo marca="SOLAR" />
    </div>
  );
}

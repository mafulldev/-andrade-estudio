// BRASA — layout próprio da demo: fontes e identidade escopadas na rota.
// O dourado do estúdio aparece apenas na barra de demonstração.

import { Cormorant_Garamond, Karla } from "next/font/google";
import BarraDemo from "@/components/demos/BarraDemo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--fonte-brasa-titulo",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--fonte-brasa-corpo",
  display: "swap",
});

export default function LayoutBrasa({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${karla.variable}`} data-demo="true">
      {children}
      <BarraDemo marca="BRASA" />
    </div>
  );
}

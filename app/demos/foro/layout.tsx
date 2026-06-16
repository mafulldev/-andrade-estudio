// FORO — layout próprio da demo: fontes e identidade escopadas na rota.

import { Playfair_Display, Public_Sans } from "next/font/google";
import BarraDemo from "@/components/demos/BarraDemo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--fonte-foro-titulo",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--fonte-foro-corpo",
  display: "swap",
});

export default function LayoutForo({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${publicSans.variable}`} data-demo="true">
      {children}
      <BarraDemo marca="FORO" />
    </div>
  );
}

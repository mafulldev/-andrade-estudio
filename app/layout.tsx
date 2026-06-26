import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import ScrollSceneProvider from "@/components/ScrollSceneProvider";
import Cursor from "@/components/Cursor";
import ProgressoScroll from "@/components/ProgressoScroll";
import Toasts from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";
import VeuRotas from "@/components/VeuRotas";
import { COOKIE_TEMA, THEME_COLOR } from "@/lib/tema";
import "lenis/dist/lenis.css";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "ANDRADE, Estúdio digital",
    template: "%s · ANDRADE",
  },
  description:
    "Arquitetura digital sob assinatura. Sites e plataformas projetados por Matheus de Andrade em Sumaré, SP, remoto para o Brasil inteiro.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "ANDRADE, Estúdio digital",
  },
  verification: {
    google: "QQskuAf14P1LXIG-aFkRRG06CMcXQvBINlgTG8Mh0Cg",
  },
};

// Sem cookie: o SSR assume escuro e este script honra prefers-color-scheme
// antes da primeira pintura. Com cookie: o SSR já chega com o tema certo.
// O timeout de 1.5s é a rede de segurança do gate de revelação: se a cena
// não montar (JS falhou ou ainda carregando), o conteúdo aparece mesmo assim.
const scriptTema = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)andrade_tema=(dark|light)/);var t=m?m[1]:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var d=document.documentElement;if(d.dataset.theme!==t){d.dataset.theme=t;}var mc=document.querySelector('meta[name="theme-color"]');if(mc){mc.setAttribute("content",t==="light"?"${THEME_COLOR.light}":"${THEME_COLOR.dark}");}setTimeout(function(){d.classList.add("cena-pronta");},1500);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jarro = await cookies();
  const tema = jarro.get(COOKIE_TEMA)?.value === "light" ? "light" : "dark";

  return (
    <html
      lang="pt-BR"
      data-theme={tema}
      className={`${cormorant.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content={THEME_COLOR[tema]} />
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <ScrollSceneProvider>
          {children}
          <ProgressoScroll />
          <Cursor />
          <Toasts />
          <CommandPalette />
          <VeuRotas />
        </ScrollSceneProvider>
      </body>
    </html>
  );
}

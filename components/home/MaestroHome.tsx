"use client";

// MAESTRO da home: refresh único do ScrollTrigger depois das fontes (os
// splits das cenas já terão medido) e a delegação central de cliques:
// analytics ([data-evento]) e rolagem suave ([data-rolar]). Também assina
// o console e registra visita_home.

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/LenisProvider";
import { registrarMotion } from "@/lib/motion/registro";
import { trackEvento, type TipoEvento } from "@/lib/eventos";

registrarMotion();

const EVENTOS_VALIDOS = new Set([
  "visita_home", "diagnostico_iniciado", "etapa_concluida", "resultado_gerado",
  "whatsapp_click", "email_click", "pdf_click", "link_copiado",
  "demo_view", "demo_quero_click",
]);

const ASSINATURA = `
.---------------------------------------------.
|                                             |
|   A  N  D  R  A  D  E                       |
|   Estúdio digital. Sumaré, SP.              |
|                                             |
|   Projetado, construído e automatizado      |
|   pelo próprio estúdio. Sem template.       |
|                                             |
'---------------------------------------------'`;

export default function MaestroHome() {
  const { irPara } = useLenis();

  // analytics, assinatura e delegação de cliques
  useEffect(() => {
    trackEvento("visita_home");
    console.log(`%c${ASSINATURA}`, "color: oklch(68% 0.009 240); font-family: monospace;");

    const aoClicar = (e: Event) => {
      const alvoEvento =
        e.target instanceof Element ? e.target.closest("[data-evento]") : null;
      const tipo = alvoEvento?.getAttribute("data-evento");
      if (tipo && EVENTOS_VALIDOS.has(tipo)) trackEvento(tipo as TipoEvento);

      const rolar = e.target instanceof Element ? e.target.closest("[data-rolar]") : null;
      if (rolar) {
        e.preventDefault();
        irPara(rolar.getAttribute("data-rolar")!);
      }
    };
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, [irPara]);

  useGSAP(() => {
    // refresh único depois das fontes (os splits das cenas já terão medido)
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return null;
}

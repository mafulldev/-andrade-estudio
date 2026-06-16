// FICHA TÉCNICA do próprio site: "medido, não prometido".
// Honestidade por construção: linha SEM `medidoEm` NÃO é renderizada.
// As medições são refeitas no aceite de cada etapa de publicação.

export type Spec = {
  rotulo: string;
  valor: string;
  detalhe?: string;
  /** data ISO da medição; ausente = a linha não publica */
  medidoEm?: string;
};

export const SPECS: Spec[] = [
  {
    rotulo: "Self-test do motor de orçamento",
    valor: "4 de 4",
    detalhe: "cenários A a D em PASS, mais as verificações estáticas da casa",
    medidoEm: "2026-06-12",
  },
  {
    rotulo: "Contraste dos dois temas",
    valor: "AA",
    detalhe: "texto 15:1, secundário no mínimo 6.2:1 nos dois temas",
    medidoEm: "2026-06-12",
  },
  {
    rotulo: "Fotografia da página inicial",
    valor: "719 KB",
    detalhe: "9 fotografias em AVIF e um terminal SVG autoral, só o hero com prioridade",
    medidoEm: "2026-06-12",
  },
  {
    rotulo: "JavaScript inicial da home",
    valor: "258 KB",
    detalhe: "first load, medido no build de produção, água do hero inclusa",
    medidoEm: "2026-06-12",
  },
  {
    rotulo: "Erros de console no aceite",
    valor: "0",
    detalhe: "varrido em todas as rotas do estúdio",
    medidoEm: "2026-06-12",
  },
  {
    rotulo: "Rastreadores de terceiros",
    valor: "0",
    detalhe: "analytics em banco próprio, sem cookies de terceiros",
    medidoEm: "2026-06-12",
  },
];

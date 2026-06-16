// Scoring automático de leads (BLOCO 4, automação 2).
// Investimento acima de 15 mil +3, entre 6 e 15 mil +2; prazo urgente +2;
// caminho sob medida +1; contato fornecido +2.
// Temperatura: 6 ou mais quente, 3 a 5 morno, abaixo frio.

import type { Caminho, Respostas } from "@/lib/motor";

export type Temperatura = "quente" | "morno" | "frio";

export function pontuar(
  r: Respostas,
  caminho: Caminho,
  temContato: boolean,
): { score: number; temperatura: Temperatura } {
  let score = 0;
  if (r.invest === "acima15000") score += 3;
  if (r.invest === "6000a15000") score += 2;
  if (r.prazo === "urgente") score += 2;
  if (caminho === "sobmedida") score += 1;
  if (temContato) score += 2;

  const temperatura: Temperatura =
    score >= 6 ? "quente" : score >= 3 ? "morno" : "frio";

  return { score, temperatura };
}

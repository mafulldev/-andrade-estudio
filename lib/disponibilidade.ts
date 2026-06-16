// FONTE ÚNICA dos fatos de agenda do estúdio. Editável aqui e em nenhum
// outro lugar: o EstudioAoVivo (home) lê deste arquivo. Mantenha honesto:
// nada de "últimas vagas" inventado; é a agenda real do mês.

export const DISPONIBILIDADE = {
  atualizadoEm: "2026-06-11",
  agendaDoMes: "aberta" as "aberta" | "limitada" | "fechada",
  slaResposta: "resposta em até 1 dia útil",
};

export const ROTULO_AGENDA: Record<typeof DISPONIBILIDADE.agendaDoMes, string> = {
  aberta: "agenda do mês aberta",
  limitada: "agenda do mês com poucas janelas",
  fechada: "agenda do mês fechada, entrando em lista",
};

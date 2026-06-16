// Tipos das linhas do banco, compartilhados entre rotas de API e admin.

export const STATUS_LEAD = [
  "novo",
  "contatado",
  "proposta",
  "fechado",
  "perdido",
] as const;

export type StatusLead = (typeof STATUS_LEAD)[number];

export type LeadRegistro = {
  id: string;
  numero: number | null;
  created_at: string;
  nome: string | null;
  contato_tipo: "whatsapp" | "email" | null;
  contato: string | null;
  segmento: string | null;
  objetivo: string | null;
  funcionalidades: string[] | null;
  prazo: string | null;
  investimento: string | null;
  caminho: "pronto" | "sobmedida" | null;
  categoria: string | null;
  faixa_min: number | null;
  faixa_max: number | null;
  prazo_estimado: string | null;
  score: number | null;
  temperatura: "quente" | "morno" | "frio" | null;
  status: StatusLead;
  consentimento: boolean;
  origem: string | null;
  notas: string | null;
  followup_enviado_em: string | null;
};

export type EventoRegistro = {
  id: number;
  created_at: string;
  tipo: string;
  pagina: string | null;
  meta: Record<string, unknown>;
};

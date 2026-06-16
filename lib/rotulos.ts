// Rótulos humanos das respostas do Diagnóstico, compartilhados entre o
// consultor, a estimativa pública, os e-mails e o admin.

import type {
  Funcionalidade,
  Investimento,
  Objetivo,
  Prazo,
  Segmento,
} from "@/lib/motor";

export const ROTULO_SEGMENTO: Record<Segmento, string> = {
  restaurante: "Restaurante e food",
  saude: "Saúde e clínicas",
  advocacia: "Advocacia",
  servicos: "Serviços locais",
  imobiliario: "Imobiliário",
  loja: "Loja online",
  startup: "Startup ou empresa",
  outro: "Outro",
};

export const ROTULO_OBJETIVO: Record<Objetivo, string> = {
  vender: "Vender online",
  contatos: "Gerar contatos e orçamentos",
  presenca: "Credibilidade e presença",
  agendamentos: "Agendamentos",
  sistema: "Sistema interno ou plataforma",
};

export const ROTULO_FUNC: Record<Funcionalidade, string> = {
  pagamentos: "Pagamentos online",
  agendamento: "Agendamento",
  membros: "Área de membros ou login",
  blogSeo: "Blog e SEO",
  multiIdioma: "Multi-idioma",
  integracoes: "Integrações",
  admin: "Painel administrativo",
};

export const ROTULO_PRAZO: Record<Prazo, string> = {
  urgente: "Urgente, para esta semana",
  "2a4": "2 a 4 semanas",
  flexivel: "Flexível",
};

export const ROTULO_INVEST: Record<Investimento, string> = {
  ate2500: "Até R$ 2.500",
  "2500a6000": "R$ 2.500 a 6.000",
  "6000a15000": "R$ 6.000 a 15.000",
  acima15000: "Acima de R$ 15.000",
  verEstimativa: "Prefiro ver a estimativa",
};

export const ROTULO_CAMINHO = {
  pronto: "Modelo pronto",
  sobmedida: "Sob medida",
} as const;

export const ROTULO_CATEGORIA = {
  pronto: "presença refinada",
  institucional: "site institucional autoral",
  ecommerce: "loja online completa",
  sistema: "sistema com painel",
} as const;

export function real(v: number): string {
  return `R$ ${v.toLocaleString("pt-BR")}`;
}

export function faixaPorExtenso(min: number, max: number): string {
  return `${real(min)} a ${real(max)}`;
}

export function dataPorExtenso(d: Date): string {
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

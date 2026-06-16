// Motor de avaliação do Diagnóstico: função pura, compartilhada entre o
// cliente, a rota de API e o selftest. Nenhuma dependência externa.

export type Segmento =
  | "restaurante"
  | "saude"
  | "advocacia"
  | "servicos"
  | "imobiliario"
  | "loja"
  | "startup"
  | "outro";

export type Objetivo =
  | "vender"
  | "contatos"
  | "presenca"
  | "agendamentos"
  | "sistema";

export type Funcionalidade =
  | "pagamentos"
  | "agendamento"
  | "membros"
  | "blogSeo"
  | "multiIdioma"
  | "integracoes"
  | "admin";

export type Prazo = "urgente" | "2a4" | "flexivel";

export type Investimento =
  | "ate2500"
  | "2500a6000"
  | "6000a15000"
  | "acima15000"
  | "verEstimativa";

export type Caminho = "pronto" | "sobmedida";
export type Categoria = "pronto" | "institucional" | "ecommerce" | "sistema";

export interface Respostas {
  segmento: Segmento;
  objetivo: Objetivo;
  func: Funcionalidade[];
  prazo: Prazo;
  invest: Investimento;
}

export interface Avaliacao {
  caminho: Caminho;
  categoria: Categoria;
  faixaMin: number;
  faixaMax: number;
  prazoEstimado: string;
}

const CUSTOM: Funcionalidade[] = ["pagamentos", "membros", "integracoes", "admin"];

export const PRICING = {
  base: {
    pronto: [1200, 2500],
    institucional: [2800, 5500],
    ecommerce: [6500, 14000],
    sistema: [9000, 30000],
  },
  modulos: {
    pagamentos: [1500, 3000],
    agendamento: [800, 1800],
    membros: [2000, 4500],
    blogSeo: [600, 1500],
    multiIdioma: [700, 1600],
    integracoes: [900, 2200],
    admin: [2500, 6000],
  },
  inclusos: {
    ecommerce: ["pagamentos"],
    sistema: ["admin"],
  },
  multUrgenteSobMedida: 1.25,
} as const;

export const PRAZOS: Record<Categoria, string> = {
  pronto: "até 1 dia útil",
  institucional: "2 a 4 semanas",
  ecommerce: "4 a 8 semanas",
  sistema: "6 a 12 semanas",
};

export const DISCLAIMER =
  "Estimativa preliminar. O valor final é definido após análise do briefing, sem compromisso.";

function caminho(r: Respostas): Caminho {
  const custom = r.func.some((f) => CUSTOM.includes(f)) || r.objetivo === "sistema";
  if (custom) return "sobmedida";
  if (r.prazo === "urgente" || r.invest === "ate2500") return "pronto";
  if (r.objetivo === "presenca") return "pronto";
  return "sobmedida";
}

function categoria(r: Respostas, cam: Caminho): Categoria {
  if (r.objetivo === "vender") return "ecommerce";
  if (r.objetivo === "sistema" || r.func.includes("admin")) return "sistema";
  return cam === "pronto" ? "pronto" : "institucional";
}

const arredonda50 = (v: number) => Math.round(v / 50) * 50;

export function avaliar(r: Respostas): Avaliacao {
  const cam = caminho(r);
  const cat = categoria(r, cam);

  const inclusos: readonly string[] =
    cat in PRICING.inclusos
      ? PRICING.inclusos[cat as keyof typeof PRICING.inclusos]
      : [];

  let [min, max] = PRICING.base[cat] as readonly [number, number];
  for (const f of r.func) {
    if (inclusos.includes(f)) continue;
    const [mMin, mMax] = PRICING.modulos[f];
    min += mMin;
    max += mMax;
  }

  if (cam === "sobmedida" && r.prazo === "urgente") {
    min *= PRICING.multUrgenteSobMedida;
    max *= PRICING.multUrgenteSobMedida;
  }

  return {
    caminho: cam,
    categoria: cat,
    faixaMin: arredonda50(min),
    faixaMax: arredonda50(max),
    prazoEstimado: PRAZOS[cat],
  };
}

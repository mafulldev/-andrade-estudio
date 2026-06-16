// PROJETO REAL: o NeuroCode AI, sistema autoral do estúdio em produção.
// Fecha o capítulo Projetos com a prova do caminho sob medida: não um
// modelo de nicho, um SaaS inteiro navegável agora. Server Component;
// todos os fatos abaixo foram extraídos do código-fonte do projeto
// (auditoria de 2026-06-12) e a demo bloqueia iframe por segurança
// (X-Frame-Options DENY), por isso a vitrine é arte autoral + link vivo.

import {
  IcBlindagem,
  IcEscala,
  IcFailClosed,
  IcIa,
  IcInvestimento,
  IcSelftest,
} from "@/components/Icone";
import { BotaoLinha } from "@/components/Botoes";
import s from "@/app/page.module.css";

const DEMO = "https://frontend-gamma-rouge-67.vercel.app";

const FATOS = [
  {
    icone: <IcIa />,
    titulo: "Geração por IA com streaming",
    texto:
      "Descrição em linguagem natural vira projeto completo via Claude (Anthropic): código, preview navegável e push para o GitHub.",
  },
  {
    icone: <IcEscala />,
    titulo: "Escala de produto real",
    texto:
      "30 páginas, 33 rotas de API e 74 componentes em Next.js 16, com interface em 4 idiomas.",
  },
  {
    icone: <IcBlindagem />,
    titulo: "Segurança em camadas",
    texto:
      "Autenticação com bloqueio por padrão, Postgres com RLS nas 4 tabelas, CSP estrita e tokens cifrados em AES-256.",
  },
  {
    icone: <IcInvestimento />,
    titulo: "Assinaturas com cota no servidor",
    texto:
      "4 planos no Stripe; o limite de gerações é aplicado pela API, com trava otimista contra requisições concorrentes.",
  },
  {
    icone: <IcFailClosed />,
    titulo: "Confiabilidade fail-closed",
    texto:
      "Se o limitador de tráfego cai, a rota responde 503. Indisponível nunca vira porta aberta.",
  },
  {
    icone: <IcSelftest />,
    titulo: "Qualidade auditada",
    texto:
      "17 suítes de teste, e2e com Playwright e axe-core, Lighthouse CI e Sentry no cliente e no servidor.",
  },
];

/* arte autoral: rede neural hairline, 3 camadas (4-3-2 nós), um nó âmbar */
function ArteNeuro() {
  return (
    <svg
      className={s.projetoArteSvg}
      data-neuro
      viewBox="0 0 320 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {/* arestas, camada 1 para 2 */}
      <path d="M48 36 L160 56" />
      <path d="M48 88 L160 56" />
      <path d="M48 88 L160 104" />
      <path d="M48 140 L160 104" />
      <path d="M48 140 L160 152" />
      <path d="M48 36 L160 104" />
      <path d="M48 192 L160 152" />
      <path d="M48 192 L160 104" />
      {/* arestas, camada 2 para 3 */}
      <path d="M160 56 L272 76" />
      <path d="M160 104 L272 76" />
      <path d="M160 104 L272 132" />
      <path d="M160 152 L272 132" />
      {/* nós: entrada, oculta, saída */}
      <circle cx="48" cy="36" r="3" />
      <circle cx="48" cy="88" r="3" />
      <circle cx="48" cy="140" r="3" />
      <circle cx="48" cy="192" r="3" />
      <circle cx="160" cy="56" r="3" />
      <circle cx="160" cy="104" r="3" />
      <circle cx="160" cy="152" r="3" />
      <circle cx="272" cy="76" r="3" />
      {/* o único acento: a saída acesa */}
      <circle cx="272" cy="132" r="3.5" fill="var(--warm)" stroke="var(--warm)" data-neuro-acento />
    </svg>
  );
}

export default function ProjetoReal() {
  return (
    <div className={s.projetoReal}>
      <div className={s.projetoCabeca}>
        <div>
          <p className="label">Sistema autoral · em produção</p>
          <h3 className={s.projetoNome} data-projeto-nome>
            NEUROCODE AI
          </h3>
          <p className={s.projetoResumo}>
            Os cinco modelos mostram o caminho pronto. Este mostra o outro:
            uma plataforma SaaS inteira, do mesmo autor, que gera projetos de
            software completos a partir de uma descrição em linguagem natural,
            com preview ao vivo, exportação em ZIP e push para o GitHub.
          </p>
        </div>
        <div className={s.projetoArte} data-projeto-arte>
          <ArteNeuro />
        </div>
      </div>

      <ul className={s.projetoFatos}>
        {FATOS.map((f) => (
          <li key={f.titulo} data-projeto-fato>
            <span className={s.projetoIcone}>{f.icone}</span>
            <div>
              <h4 className={s.projetoFatoTitulo}>{f.titulo}</h4>
              <p className={s.projetoFatoTexto}>{f.texto}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={s.projetoCta} data-projeto-cta>
        <BotaoLinha href={DEMO} externo primario cursor="ABRIR">
          Abrir o NeuroCode ao vivo
        </BotaoLinha>
        <span className="label">Em produção na Vercel, navegável agora</span>
      </div>
    </div>
  );
}

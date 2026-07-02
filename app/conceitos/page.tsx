// Galeria de conceitos: peças de demonstração (fictícias) em duas famílias.
// "sistema" = demonstração FUNCIONAL (roda no navegador, dados fictícios);
// "site" = estudo de interface/motion. Cada card abre /trabalhos/<slug>/.
// Honestidade: rotulados como demo/conceito, nunca como cliente real.

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import s from "./conceitos.module.css";

export const metadata: Metadata = {
  title: "Conceitos",
  description:
    "Sistemas funcionais e estudos de interface do ANDRADE, Estúdio digital: demonstrações que exploram produto, linguagem visual, motion e conversão em nichos de alto valor.",
};

type Conceito = {
  slug: string;
  nome: string;
  nicho: string;
  desc: string;
  stack: string;
  img: string;
  tipo: "site" | "sistema";
};

const CONCEITOS: Conceito[] = [
  {
    slug: "vetor-analytics",
    nome: "VETOR",
    nicho: "SaaS e assinaturas",
    desc: "Analytics de receita recorrente: MRR em cascata, cohort de retenção e inadimplência recuperável com régua de cobrança.",
    stack: "JS puro · gráficos SVG · dados no navegador",
    img: "/trabalhos/vetor-analytics/thumb.svg",
    tipo: "sistema",
  },
  {
    slug: "lastro-estoque",
    nome: "LASTRO",
    nicho: "Gestão de estoque",
    desc: "Estoque com curva ABC, ponto de pedido calculado e lista de compra sugerida. Movimentações recalculam o custo médio.",
    stack: "JS puro · gráficos SVG · dados no navegador",
    img: "/trabalhos/lastro-estoque/thumb.svg",
    tipo: "sistema",
  },
  {
    slug: "mare-commerce",
    nome: "MARÉ",
    nicho: "E-commerce",
    desc: "Admin de pedidos com PIX expirando ao vivo, fila de expedição e rastreio dos Correios, em split-pane de operação.",
    stack: "JS puro · gráficos SVG · dados no navegador",
    img: "/trabalhos/mare-commerce/thumb.svg",
    tipo: "sistema",
  },
  {
    slug: "tracao-crm",
    nome: "TRAÇÃO",
    nicho: "Vendas e CRM",
    desc: "Pipeline kanban arrastável com cards esquecidos, motivo de perda obrigatório e funil por etapa. WhatsApp no card.",
    stack: "JS puro · gráficos SVG · dados no navegador",
    img: "/trabalhos/tracao-crm/thumb.svg",
    tipo: "sistema",
  },
  {
    slug: "amparo-clinica",
    nome: "AMPARO",
    nicho: "Saúde",
    desc: "Agenda de clínica colorida por status, régua de confirmação por WhatsApp e retorno em 30 dias. Convênio e particular.",
    stack: "JS puro · gráficos SVG · dados no navegador",
    img: "/trabalhos/amparo-clinica/thumb.svg",
    tipo: "sistema",
  },
  {
    slug: "rivage",
    nome: "Rivage",
    nicho: "Imobiliária de luxo",
    desc: "Coleção privada de residências de luxo. Hero em WebGL, galeria cinematográfica, bilíngue e captura de leads.",
    stack: "React · Vite · WebGL · GSAP",
    img: "/trabalhos/rivage/properties/casa-pelican-1-768.avif",
    tipo: "site",
  },
  {
    slug: "meridiano",
    nome: "Meridiano",
    nicho: "Expedições",
    desc: "Casa de expedições a paisagens extremas. Visual 100% vetorial em CSS e SVG, narrativa guiada por scroll.",
    stack: "HTML · CSS · SVG · GSAP",
    img: "/fotos/coda-horizonte.avif",
    tipo: "site",
  },
  {
    slug: "the-silent-vault",
    nome: "The Silent Vault",
    nicho: "Private banking",
    desc: "Private banking e inteligência de capital. Sobriedade editorial e tipografia de precisão.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=70",
    tipo: "site",
  },
  {
    slug: "the-longevity-sanctuary",
    nome: "The Longevity Sanctuary",
    nicho: "Longevidade",
    desc: "Resort de longevidade e biohacking. Jornada longa, imersiva, com chamadas de conversão.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=70",
    tipo: "site",
  },
  {
    slug: "the-invisible-engine",
    nome: "The Invisible Engine",
    nicho: "IA e infraestrutura",
    desc: "Infraestrutura de IA e data center. Fundo gerado em tempo real com canvas.",
    stack: "HTML · Canvas · GSAP",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=70",
    tipo: "site",
  },
  {
    slug: "precision-smile-atelier",
    nome: "Precision Smile Atelier",
    nicho: "Odontologia premium",
    desc: "Odontologia premium e implantes. Comparador antes e depois interativo.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=70",
    tipo: "site",
  },
];

function CartaoConceito({ c }: { c: Conceito }) {
  const sistema = c.tipo === "sistema";
  return (
    <li>
      <a className={s.card} href={`/trabalhos/${c.slug}/index.html`}>
        <span className={s.thumbWrap}>
          {c.img.endsWith(".svg") ? (
            /* thumb.svg autoral dos sistemas: <img> comum, fora do otimizador */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className={`${s.thumb} ${s.thumbCheia}`}
              src={c.img}
              alt=""
              loading="lazy"
            />
          ) : (
            <Image
              className={s.thumb}
              src={c.img}
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 400px"
            />
          )}
          <span className={s.tag}>
            {sistema ? "demo funcional" : "conceito"}
          </span>
        </span>
        <span className={s.corpo}>
          <span className={`label ${s.nicho}`}>{c.nicho}</span>
          <h3 className={s.nome}>{c.nome}</h3>
          <p className={s.desc}>{c.desc}</p>
          <span className={s.stack}>{c.stack}</span>
          <span className={s.ver} aria-hidden="true">
            {sistema ? "Usar a demonstração" : "Ver ao vivo"}
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M7 17 17 7M9 7h8v8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </a>
    </li>
  );
}

export default function PaginaConceitos() {
  const sistemas = CONCEITOS.filter((c) => c.tipo === "sistema");
  const sites = CONCEITOS.filter((c) => c.tipo === "site");
  return (
    <main id="conteudo" className={s.pagina}>
      <header className={s.cabeca}>
        <Link
          href="/"
          className="monograma"
          aria-label="ANDRADE, voltar ao site"
        >
          A
        </Link>
        <span className="label">Conceitos</span>
        <h1 className={s.titulo}>Sistemas e estudos.</h1>
        <p className="mudo">
          Peças de demonstração: conceitos fictícios criados para explorar
          produto, linguagem visual, motion e conversão em nichos de alto valor.
          Não são clientes reais, são exercícios de capacidade. Nos sistemas,
          tudo funciona de verdade no navegador, com dados fictícios.
        </p>
      </header>

      {sistemas.length > 0 && (
        <section className={s.secao} aria-labelledby="sec-sistemas">
          <h2 id="sec-sistemas" className={s.secaoTitulo}>
            Sistemas e plataformas
          </h2>
          <p className={`mudo ${s.secaoDesc}`}>
            Demonstrações funcionais: entre e use, direto no navegador.
          </p>
          <ul className={s.grade}>
            {sistemas.map((c) => (
              <CartaoConceito key={c.slug} c={c} />
            ))}
          </ul>
        </section>
      )}

      <section className={s.secao} aria-labelledby="sec-sites">
        <h2 id="sec-sites" className={s.secaoTitulo}>
          Estudos de interface
        </h2>
        <ul className={s.grade}>
          {sites.map((c) => (
            <CartaoConceito key={c.slug} c={c} />
          ))}
        </ul>
      </section>

      <footer className={s.rodape}>
        <Link href="/" className="label">
          Voltar ao estúdio
        </Link>
      </footer>
    </main>
  );
}

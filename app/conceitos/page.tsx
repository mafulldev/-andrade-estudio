// Galeria de conceitos: peças de demonstração (fictícias) que exploram
// linguagem visual, motion e conversão em nichos de alto valor. Cada card
// abre o site ao vivo, hospedado em /trabalhos/<slug>/ no próprio domínio.
// Honestidade: rotulados como "conceito", nunca como cliente real.

import Link from "next/link";
import type { Metadata } from "next";
import s from "./conceitos.module.css";

export const metadata: Metadata = {
  title: "Conceitos",
  description:
    "Estudos de interface do ANDRADE, Estúdio digital: peças de demonstração que exploram linguagem visual, motion e conversão em nichos de alto valor.",
};

type Conceito = {
  slug: string;
  nome: string;
  nicho: string;
  desc: string;
  stack: string;
};

const CONCEITOS: Conceito[] = [
  {
    slug: "rivage",
    nome: "Rivage",
    nicho: "Imobiliária de luxo",
    desc: "Coleção privada de residências de luxo. Hero em WebGL, galeria cinematográfica, bilíngue e captura de leads.",
    stack: "React · Vite · WebGL · GSAP",
  },
  {
    slug: "meridiano",
    nome: "Meridiano",
    nicho: "Expedições",
    desc: "Casa de expedições a paisagens extremas. Visual 100% vetorial em CSS e SVG, narrativa guiada por scroll.",
    stack: "HTML · CSS · SVG · GSAP",
  },
  {
    slug: "the-silent-vault",
    nome: "The Silent Vault",
    nicho: "Private banking",
    desc: "Private banking e inteligência de capital. Sobriedade editorial e tipografia de precisão.",
    stack: "HTML · GSAP",
  },
  {
    slug: "the-longevity-sanctuary",
    nome: "The Longevity Sanctuary",
    nicho: "Longevidade",
    desc: "Resort de longevidade e biohacking. Jornada longa, imersiva, com chamadas de conversão.",
    stack: "HTML · GSAP",
  },
  {
    slug: "the-invisible-engine",
    nome: "The Invisible Engine",
    nicho: "IA e infraestrutura",
    desc: "Infraestrutura de IA e data center. Fundo gerado em tempo real com canvas.",
    stack: "HTML · Canvas · GSAP",
  },
  {
    slug: "precision-smile-atelier",
    nome: "Precision Smile Atelier",
    nicho: "Odontologia premium",
    desc: "Odontologia premium e implantes. Comparador antes e depois interativo.",
    stack: "HTML · GSAP",
  },
];

export default function PaginaConceitos() {
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
        <h1 className={s.titulo}>Estudos de interface.</h1>
        <p className="mudo">
          Peças de demonstração: conceitos fictícios criados para explorar
          linguagem visual, motion e conversão em nichos de alto valor. Não são
          clientes reais, são exercícios de capacidade.
        </p>
      </header>

      <ul className={s.grade}>
        {CONCEITOS.map((c) => (
          <li key={c.slug}>
            <a
              className={s.card}
              href={`/trabalhos/${c.slug}/index.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={s.tag}>conceito</span>
              <span className={`label ${s.nicho}`}>{c.nicho}</span>
              <h2 className={s.nome}>{c.nome}</h2>
              <p className={s.desc}>{c.desc}</p>
              <span className={s.stack}>{c.stack}</span>
              <span className={s.ver} aria-hidden="true">
                Ver ao vivo
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
            </a>
          </li>
        ))}
      </ul>

      <footer className={s.rodape}>
        <Link href="/" className="label">
          Voltar ao estúdio
        </Link>
      </footer>
    </main>
  );
}

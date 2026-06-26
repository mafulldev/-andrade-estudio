// Galeria de conceitos: peças de demonstração (fictícias) que exploram
// linguagem visual, motion e conversão em nichos de alto valor. Cada card
// mostra um thumbnail real e abre o site ao vivo em /trabalhos/<slug>/.
// Honestidade: rotulados como "conceito", nunca como cliente real.

import Link from "next/link";
import Image from "next/image";
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
  img: string;
};

const CONCEITOS: Conceito[] = [
  {
    slug: "rivage",
    nome: "Rivage",
    nicho: "Imobiliária de luxo",
    desc: "Coleção privada de residências de luxo. Hero em WebGL, galeria cinematográfica, bilíngue e captura de leads.",
    stack: "React · Vite · WebGL · GSAP",
    img: "/trabalhos/rivage/properties/casa-pelican-1-768.avif",
  },
  {
    slug: "meridiano",
    nome: "Meridiano",
    nicho: "Expedições",
    desc: "Casa de expedições a paisagens extremas. Visual 100% vetorial em CSS e SVG, narrativa guiada por scroll.",
    stack: "HTML · CSS · SVG · GSAP",
    img: "/fotos/coda-horizonte.avif",
  },
  {
    slug: "the-silent-vault",
    nome: "The Silent Vault",
    nicho: "Private banking",
    desc: "Private banking e inteligência de capital. Sobriedade editorial e tipografia de precisão.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=70",
  },
  {
    slug: "the-longevity-sanctuary",
    nome: "The Longevity Sanctuary",
    nicho: "Longevidade",
    desc: "Resort de longevidade e biohacking. Jornada longa, imersiva, com chamadas de conversão.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=70",
  },
  {
    slug: "the-invisible-engine",
    nome: "The Invisible Engine",
    nicho: "IA e infraestrutura",
    desc: "Infraestrutura de IA e data center. Fundo gerado em tempo real com canvas.",
    stack: "HTML · Canvas · GSAP",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=70",
  },
  {
    slug: "precision-smile-atelier",
    nome: "Precision Smile Atelier",
    nicho: "Odontologia premium",
    desc: "Odontologia premium e implantes. Comparador antes e depois interativo.",
    stack: "HTML · GSAP",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=70",
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
            <a className={s.card} href={`/trabalhos/${c.slug}/index.html`}>
              <span className={s.thumbWrap}>
                <Image
                  className={s.thumb}
                  src={c.img}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 400px"
                />
                <span className={s.tag}>conceito</span>
              </span>
              <span className={s.corpo}>
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

"use client";

// FORO, advocacia: one-page de 5 cenas sobre o regime compartilhado
// (useCenaDemo): hero de declaração com plate de arquivo, títulos por
// linha, plates por clip-path com parallax interno.
// Assinatura da demo: sublinhado caligráfico em SVG sob termos-chave,
// desenhado por stroke-dashoffset ao entrar no viewport.

import Image from "next/image";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { mostrarToast } from "@/components/Toast";
import { useLenis } from "@/components/LenisProvider";
import { useCenaDemo } from "@/components/demos/useCenaDemo";
import s from "@/app/demos/foro/foro.module.css";

const AREAS = [
  {
    nome: "Civil",
    desc: "Contratos, responsabilidade e patrimônio, da consultoria preventiva ao contencioso.",
  },
  {
    nome: "Empresarial",
    desc: "Societário, governança e operações de empresas em crescimento.",
  },
  {
    nome: "Trabalhista",
    desc: "Prevenção e defesa, do acordo bem redigido à audiência.",
  },
  {
    nome: "Família",
    desc: "Sucessões, inventários e divórcios, com a discrição que esses temas pedem.",
  },
  {
    nome: "Digital",
    desc: "Dados pessoais, plataformas e reputação no ambiente eletrônico.",
  },
];

const ARTIGOS = [
  {
    data: "12 de maio de 2026",
    titulo: "O contrato como instrumento de previsibilidade",
    resumo:
      "Cláusulas claras custam menos que litígios longos. O que todo contrato de prestação de serviços deveria prever antes da assinatura.",
    foto: "/demos/foro/artigo-contrato.avif",
  },
  {
    data: "28 de março de 2026",
    titulo: "Guarda compartilhada: o que muda na prática",
    resumo:
      "A diferença entre guarda e convivência, e por que o calendário importa mais que o rótulo no acordo entre as partes.",
    foto: "/demos/foro/artigo-familia.avif",
  },
  {
    data: "9 de fevereiro de 2026",
    titulo: "Proteção de dados para pequenas empresas: por onde começar",
    resumo:
      "O mapeamento mínimo que a LGPD espera de qualquer operação, mesmo a de um escritório com três pessoas.",
    foto: "/demos/foro/artigo-lgpd.avif",
  },
];

function Sublinhado({ children }: { children: ReactNode }) {
  return (
    <span className={s.sub}>
      {children}
      <svg
        className={s.subSvg}
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          data-sublinhado
          d="M4 9 C 40 13, 72 4, 102 8 S 168 12, 196 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function ForoPagina() {
  const raizRef = useRef<HTMLDivElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", area: "Civil", relato: "" });
  const { irPara } = useLenis();

  useCenaDemo(raizRef);

  // assinatura: sublinhado caligráfico por stroke-dashoffset
  useGSAP(
    () => {
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<SVGPathElement>("[data-sublinhado]").forEach((caminho) => {
        const comprimento = caminho.getTotalLength();
        caminho.style.strokeDasharray = `${comprimento}`;
        if (reduzido) {
          caminho.style.strokeDashoffset = "0";
          return;
        }
        caminho.style.strokeDashoffset = `${comprimento}`;
        gsap.to(caminho, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "expo.out",
          delay: 0.5,
          scrollTrigger: { trigger: caminho, start: "top 88%", once: true },
        });
      });
    },
    { scope: raizRef },
  );

  const consultar = (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (form.nome.trim().length < 2) {
      mostrarToast("Diga seu nome para a consulta.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      mostrarToast("Confira o e-mail informado.");
      return;
    }
    if (form.relato.trim().length < 10) {
      mostrarToast("Descreva o caso em uma ou duas frases.");
      return;
    }
    setEnviando(true);
    // demonstração: simula o envio, sem gravar no banco
    window.setTimeout(() => {
      setEnviando(false);
      setForm({ nome: "", email: "", area: "Civil", relato: "" });
      mostrarToast("Consulta solicitada. Retornamos em até um dia útil.");
    }, 800);
  };

  return (
    <div className={s.pagina} ref={raizRef}>
      {/* 1. HERO: a declaração de princípio */}
      <section className={s.hero} data-hero data-hero-conjunto>
        <div className={s.heroTopo}>
          <span className={s.wordmark}>FORO</span>
          <span className={s.rotulo}>Advocacia · Campinas, SP</span>
        </div>
        <span className={s.rotulo} data-hero-item>
          Cinco áreas, um método
        </span>
        <h1 className={`${s.titulo} ${s.heroTitulo}`} data-hero-linhas>
          <span className="linha">
            <span data-linha>
              Primeiro o <Sublinhado>princípio</Sublinhado>,
            </span>
          </span>
          <span className="linha">
            <span data-linha>
              depois a <em>estratégia</em>.
            </span>
          </span>
        </h1>
        <p className={s.heroSub} data-hero-item>
          Advocacia que se exerce por escrito: tese clara, prazo cumprido e
          cliente informado em cada etapa do processo.
        </p>
        <button
          type="button"
          className={s.botaoForo}
          data-hero-item
          onClick={() => irPara("#consulta")}
        >
          Agendar consulta
        </button>
        <div className={`${s.foto} ${s.heroFoto}`} data-hero-plate data-parallax>
          <Image
            src="/demos/foro/arquivo.avif"
            alt="Detalhe do arquivo do escritório"
            fill
            priority
            sizes="(max-width: 860px) 280px, 230px"
          />
        </div>
      </section>

      {/* 2. ÁREAS NUMERADAS */}
      <section className={s.secao} id="areas">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Áreas de atuação
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>
                Onde o escritório <Sublinhado>atua</Sublinhado>.
              </span>
            </span>
          </h2>
        </div>
        <div className={s.areas}>
          {AREAS.map((a, i) => (
            <div className={s.area} key={a.nome} data-reveal="mascara">
              <span className={s.areaNum}>0{i + 1}</span>
              <span className={s.areaNome}>{a.nome}</span>
              <span className={s.areaDesc}>{a.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. O ESCRITÓRIO */}
      <section className={s.secao} id="escritorio">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            O escritório
          </span>
        </div>
        <div className={s.escritorio}>
          <div className={`${s.foto} ${s.escFoto}`} data-reveal="plate" data-parallax>
            <Image
              src="/demos/foro/biblioteca.avif"
              alt="A biblioteca do escritório"
              fill
              sizes="(max-width: 860px) 100vw, 460px"
            />
          </div>
          <div className={s.escTexto}>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Um escritório de tese,</span>
              </span>
              <span className="linha">
                <span data-linha>não de volume.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              O FORO atende um número limitado de casos por área. A escolha é
              deliberada: cada processo recebe o sócio responsável do início ao
              fim, sem repasse e sem fila.
            </p>
            <p data-reveal="mascara">
              Honorários são apresentados por escrito antes do aceite, com
              escopo, etapas e critérios de êxito definidos em contrato.
            </p>
            <ul className={s.escPrincipios} data-reveal="mascara">
              <li>Tese por escrito antes de qualquer ação</li>
              <li>Resposta em até um dia útil</li>
              <li>Relatório mensal de andamento, sem juridiquês</li>
              <li>Sigilo e conflito de interesses verificados na entrada</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. PUBLICAÇÕES */}
      <section className={s.secao} id="publicacoes">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Publicações
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>O que o escritório escreve.</span>
            </span>
          </h2>
        </div>
        <div className={s.publicacoes}>
          {ARTIGOS.map((a) => (
            <article className={s.artigo} key={a.titulo}>
              <div className={`${s.foto} ${s.artigoFoto}`} data-reveal="plate">
                <Image
                  src={a.foto}
                  alt={`Imagem da publicação ${a.titulo}`}
                  fill
                  sizes="(max-width: 860px) 360px, 220px"
                />
              </div>
              <span className={s.artigoData} data-reveal="mascara">
                {a.data}
              </span>
              <h3 className={s.artigoTitulo} data-reveal="mascara">
                {a.titulo}
              </h3>
              <p className={s.artigoResumo} data-reveal="mascara">
                {a.resumo}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CONSULTA E ENDEREÇO */}
      <section className={s.secao} id="consulta">
        <div className={s.consulta}>
          <div className={s.consultaInfo}>
            <span className={s.rotulo} data-reveal="mascara">
              Consulta
            </span>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Conte o caso. Nós dizemos</span>
              </span>
              <span className="linha">
                <span data-linha>se há tese.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              A primeira conversa avalia viabilidade e prazos, sem compromisso.
              Casos urgentes com prazo processual em curso têm prioridade.
            </p>
            <div className={`${s.foto} ${s.consultaFoto}`} data-reveal="plate" data-parallax>
              <Image
                src="/demos/foro/sala-reuniao.avif"
                alt="A sala de reunião do escritório"
                fill
                sizes="(max-width: 860px) 100vw, 480px"
              />
            </div>
            <p data-reveal="mascara">
              <strong>Endereço.</strong> Rua Quinze de Novembro, 1200, conjunto
              84. Centro, Campinas, SP.
            </p>
            <p data-reveal="mascara">
              <strong>Horário.</strong> Segunda a sexta, das 9h às 18h, com
              agendamento prévio.
            </p>
          </div>
          <form className={s.consultaForm} onSubmit={consultar} data-reveal="mascara">
            <label className={s.campoForo}>
              <span>Nome</span>
              <input
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>
            <label className={s.campoForo}>
              <span>E-mail</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className={`${s.campoForo} ${s.campoLargo}`}>
              <span>Área</span>
              <select
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              >
                {AREAS.map((a) => (
                  <option key={a.nome} value={a.nome}>{a.nome}</option>
                ))}
              </select>
            </label>
            <label className={`${s.campoForo} ${s.campoLargo}`}>
              <span>Breve relato do caso</span>
              <textarea
                rows={4}
                value={form.relato}
                onChange={(e) => setForm({ ...form, relato: e.target.value })}
              />
            </label>
            <div className={s.campoLargo}>
              <button type="submit" className={s.botaoForo} disabled={enviando}>
                {enviando ? "Enviando" : "Solicitar consulta"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className={s.rodape}>
        <span>FORO, advocacia. Campinas, SP.</span>
        <span>
          Marca fictícia criada para demonstração pelo ANDRADE, Estúdio digital.
        </span>
      </footer>
    </div>
  );
}

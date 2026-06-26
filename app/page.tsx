// HOME — CINEMA EDITORIAL NOTURNO. Server Component com 100% da copy
// (SEO intacto); os capítulos client (Cena01-03 + Maestro) coreografam o
// DOM já presente. Fluido ÚNICO fixo atrás de tudo, com presença regida
// pelo Maestro. Caps 04 a 06 e a coda estão em fluxo editorial provisório
// (coreografias completas chegam na etapa 3). Conteúdo 100% honesto.

import Link from "next/link";
import Header from "@/components/Header";
import Figura from "@/components/Figura";
import Figuras from "@/components/home/Figuras";
import RailSecoes from "@/components/home/RailSecoes";
import MaestroHome from "@/components/home/MaestroHome";
import Cena01Abertura from "@/components/home/cenas/Cena01Abertura";
import Cena02Caminhos from "@/components/home/cenas/Cena02Caminhos";
import Cena03Modelos from "@/components/home/cenas/Cena03Modelos";
import CenaProjetoReal from "@/components/home/cenas/CenaProjetoReal";
import ProjetoReal from "@/components/home/ProjetoReal";
import Cena04Portal from "@/components/home/cenas/Cena04Portal";
import Cena05Estudio from "@/components/home/cenas/Cena05Estudio";
import Cena06Investimento from "@/components/home/cenas/Cena06Investimento";
import Cena07Bastidores from "@/components/home/cenas/Cena07Bastidores";
import CenaCoda from "@/components/home/cenas/CenaCoda";
import EstudioAoVivo from "@/components/EstudioAoVivo";
import PassoProcesso from "@/components/home/PassoProcesso";
import Bastidores from "@/components/home/Bastidores";
import FichaTecnica from "@/components/home/FichaTecnica";
import Garantias from "@/components/home/Garantias";
import {
  PictoDesenho,
  PictoEntrega,
  PictoEscuta,
  PictoPrumo,
} from "@/components/Pictogramas";
import Comparador from "@/components/home/Comparador";
import ShowcaseModelos from "@/components/home/ShowcaseModelos";
import Eyebrow from "@/components/Eyebrow";
import Accordion from "@/components/Accordion";
import { BotaoCircular, BotaoLinha } from "@/components/Botoes";
import Magnetico from "@/components/Magnetico";
import AssinaturaAndrade from "@/components/AssinaturaAndrade";
import { IcoSetaDiagonal, IcoSetaDireita } from "@/components/Icones";
import s from "./page.module.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP = "https://wa.me/5519971460099";
const EMAIL = "ma.fulldev@gmail.com";

const PERGUNTAS = [
  "Qual é o seu segmento?",
  "Qual é o objetivo principal?",
  "O que o projeto precisa ter?",
  "Para quando?",
  "Quanto pretende investir?",
  "Para quem é a estimativa?",
];

const PASSOS = [
  {
    titulo: "Responda o diagnóstico",
    texto: "Seis perguntas sobre o projeto, em dois minutos.",
    entregaveis: [
      "Faixa de investimento na hora",
      "Caminho recomendado pelo motor",
      "Link permanente no seu e-mail",
    ],
    figura: {
      src: "/fotos/processo-01.avif",
      alt: "Pena de caneta tinteiro tocando o papel na penumbra",
    },
  },
  {
    titulo: "Briefing e proposta",
    texto: "Conversa direta e proposta por escrito, sem letra miúda.",
    entregaveis: [
      "Roteiro de organização do material",
      "Proposta detalhada por escrito",
      "Escopo e rodadas definidos antes",
    ],
    figura: {
      src: "/fotos/processo-02.avif",
      alt: "Mãos desenhando sobre prancheta com régua de escala",
    },
  },
  {
    titulo: "Construção",
    texto: "Design e código na mesma mão, com prévias reais.",
    entregaveis: [
      "Prévia navegável para aprovação",
      "Uma rodada inclusa nos prontos",
      "Rodadas por etapa no sob medida",
    ],
    figura: {
      src: "/fotos/processo-03.avif",
      alt: "Mão sobre teclado escuro com duas teclas alaranjadas",
    },
  },
  {
    titulo: "Entrega e estreia",
    texto: "Publicação com tudo em seu nome, do domínio ao código.",
    entregaveis: [
      "Domínio e acessos documentados",
      "Treinamento de uso incluso",
      "Código entregue com repositório",
    ],
    figura: {
      src: "/fotos/processo-04.avif",
      alt: "Mesa de trabalho à noite com luminária acesa e monitor",
    },
  },
];

const PICTOS_PASSOS = [
  <PictoEscuta key="escuta" />,
  <PictoDesenho key="desenho" />,
  <PictoPrumo key="prumo" />,
  <PictoEntrega key="entrega" />,
];

const FATOS = [
  { numero: "1", sufixo: " dia útil", rotulo: "entrega dos modelos prontos" },
  { numero: "5", sufixo: "", rotulo: "modelos completos ao vivo" },
  { numero: "6", sufixo: "", rotulo: "perguntas até a estimativa" },
  { numero: "100%", sufixo: "", rotulo: "do código entregue ao cliente" },
  { numero: "2", sufixo: "", rotulo: "temas, noite e marfim" },
  { numero: "R$ 1.200", sufixo: "", rotulo: "investimento de partida" },
];

const PRINCIPIOS = [
  "Entrego o código, porque o site é do cliente.",
  "Estimativa na hora. Nenhum formulário que some no vácuo.",
  "Um dia útil não é pressa. É processo refinado.",
];

const PLANOS: {
  nome: string;
  valor: string;
  prazo: string;
  itens: string;
  cta: string;
  destaque?: boolean;
}[] = [
  {
    nome: "Pronto",
    valor: "R$ 1.200",
    prazo: "entrega em 1 dia útil",
    itens:
      "Modelo refinado do nicho · identidade aplicada · 1 rodada de ajustes · domínio em seu nome · código entregue",
    cta: "diagnostico",
  },
  {
    nome: "Sob medida",
    valor: "R$ 2.800",
    prazo: "2 a 4 semanas",
    itens:
      "Design exclusivo do zero · SEO técnico · animações e tema duplo · suporte de estreia · código entregue",
    cta: "diagnostico",
    destaque: true,
  },
  {
    nome: "Avançado",
    valor: "R$ 6.500",
    prazo: "e-commerce e sistemas · 4 a 12 semanas",
    itens:
      "Pagamentos online · áreas de membros · painéis administrativos · integrações",
    cta: "whatsapp",
  },
];

const FAQ = [
  {
    pergunta: "Em quanto tempo meu site fica no ar?",
    resposta:
      "Modelos prontos entram no ar em até 1 dia útil depois do envio do material. Projetos sob medida seguem o escopo: 2 a 4 semanas para institucionais, 4 a 8 para lojas online e 6 a 12 para sistemas.",
  },
  {
    pergunta: "O que preciso enviar para começar?",
    resposta:
      "Textos básicos, logotipo se houver, fotos e referências de que você gosta. O estúdio envia um roteiro simples de organização e orienta o que faltar.",
  },
  {
    pergunta: "Posso pedir ajustes depois da entrega?",
    resposta:
      "Os modelos prontos incluem uma rodada de ajustes. Nos projetos sob medida, as rodadas são definidas por etapa na proposta.",
  },
  {
    pergunta: "Domínio e hospedagem ficam em nome de quem?",
    resposta:
      "Sempre em nome do cliente. O estúdio configura tudo e entrega os acessos documentados.",
  },
  {
    pergunta: "O código do site é entregue?",
    resposta:
      "Sim. O código é entregue ao cliente ao final do projeto, com repositório e instruções de uso.",
  },
  {
    pergunta: "Existe suporte depois do lançamento?",
    resposta:
      "O lançamento acompanha suporte de estreia e treinamento de uso. Manutenção mensal é opcional e contratada à parte.",
  },
  {
    pergunta: "O estúdio atende fora de Sumaré?",
    resposta:
      "Sim. O atendimento é remoto para o Brasil inteiro, com comunicação por WhatsApp, e-mail e chamadas quando necessário.",
  },
  {
    pergunta: "Como funciona o processo do sob medida?",
    resposta:
      "Quatro etapas com aprovação: escuta do problema, arquitetura da solução, construção com design e código juntos, e entrega com publicação e treinamento.",
  },
  {
    pergunta: "A estimativa do Diagnóstico é um orçamento fechado?",
    resposta:
      "É uma estimativa preliminar. O valor final é definido após análise do briefing, sem compromisso.",
  },
  {
    pergunta: "Quais são os prazos típicos de um projeto sob medida?",
    resposta:
      "Institucionais levam de 2 a 4 semanas, lojas online de 4 a 8 e sistemas com painel de 6 a 12 semanas, conforme o escopo.",
  },
];

const MSG_AVANCADO =
  "Olá, Matheus. Tenho interesse no caminho avançado (e-commerce ou sistema) e quero conversar sobre o projeto.";
const WHATSAPP_AVANCADO = `${WHATSAPP}?text=${encodeURIComponent(MSG_AVANCADO)}`;

const jsonLdServico = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ANDRADE, Estúdio digital",
  description:
    "Estúdio digital de Matheus de Andrade: sites prontos em 1 dia útil e projetos sob medida com design e código autorais.",
  founder: { "@type": "Person", name: "Matheus de Andrade" },
  foundingDate: "2024",
  email: EMAIL,
  url: SITE,
  areaServed: "BR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sumaré",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: ["https://github.com/mafulldev"],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServico) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Header />
      <RailSecoes />
      <MaestroHome />
      <Figuras />

      <main id="conteudo" className={s.palco}>
        {/* CAP 01 · ABERTURA */}
        <Cena01Abertura className={`${s.cap} ${s.hero}`}>
          {/* HERO "A LINHA QUE ASSINA": sobre o grafite contínuo, um fio
              hairline se desenha (a assinatura sendo feita), um ponto âmbar o
              percorre como a ponta da caneta e a linha reage ao cursor. O gesto
              É a abertura: sem cortina, sem vão. data-reveal segura tudo até a
              cena estar pronta (sem flash). */}
          <div className={s.heroLinhaWrap} data-hero-wrap data-reveal>
            <div className={s.heroTexto} data-hero-texto>
              <p className={`label ${s.heroEyebrow}`} data-hero-eyebrow>
                <span className={s.heroEyebrowPonto} aria-hidden="true" />
                Estúdio digital · Sumaré, SP
              </p>
              <h1 className={s.heroTitulo} data-hero-titulo>
                Do briefing ao deploy, <em>na mesma mão.</em>
              </h1>
              <p className={s.heroApoio} data-hero-apoio>
                Design, código e estratégia, do primeiro traço ao deploy. Sites
                e plataformas feitos sob medida, sem template.
              </p>
              <div className={s.heroAcoes} data-hero-acoes>
                <Magnetico>
                  <Link
                    className={s.heroAcaoPrincipal}
                    href="/diagnostico"
                    data-cursor="INICIAR"
                  >
                    <span>Iniciar diagnóstico</span>
                    <IcoSetaDiagonal size={16} />
                  </Link>
                </Magnetico>
                <a
                  className={s.heroAcaoVer}
                  href="#cap-modelos"
                  data-rolar="#cap-modelos"
                  data-cursor="VER"
                >
                  Ver os projetos
                </a>
              </div>
              <p className={s.heroAssinatura} data-hero-assinatura>
                Assinado por quem constrói
              </p>
            </div>

            {/* ASSINATURA "Andrade" em caligrafia: surge da esquerda para a
                direita (revelação tipo serigrafia) com o ponto âmbar como a
                ponta da caneta. Coluna própria, nunca sobre o texto. */}
            <div className={s.heroPalcoLinha} data-hero-palco>
              <AssinaturaAndrade className={s.heroAssinaturaSvg} />
              <span
                className={s.heroPonta}
                data-hero-ponta
                aria-hidden="true"
              />
            </div>

            <div className={s.heroScroll} data-hero-scroll aria-hidden="true">
              <span className="label">Role</span>
              <span className={s.heroScrollLinha} />
            </div>
          </div>
        </Cena01Abertura>

        {/* CAP 02 · DOIS CAMINHOS */}
        <Cena02Caminhos className={`${s.cap} ${s.caminhos}`}>
          <svg
            className={s.caminhosLinha}
            data-caminhos-svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="var(--hairline-forte)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className={s.miolo}>
            <div className={s.caminhosCabeca} data-caminhos-cabeca>
              <span className={s.eyebrowCap}>
                <Eyebrow num="02">Soluções</Eyebrow>
              </span>
              <h2 className={s.caminhosTitulo} data-caminhos-titulo>
                Dois caminhos. Um padrão.
              </h2>
            </div>
            <Comparador />
            <div className={s.caminhosRodape} data-caminhos-rodape>
              <p className={s.caminhosNota}>
                Nos dois caminhos: estimativa na hora pelo diagnóstico, cada
                contato vira lead rastreado, e quem deixa e-mail recebe a
                estimativa automaticamente.
              </p>
              <BotaoLinha href="/diagnostico" cursor="INICIAR">
                Não sabe o caminho? Faça o diagnóstico
              </BotaoLinha>
            </div>
          </div>
        </Cena02Caminhos>

        {/* CAP 03 · OS CINCO MODELOS */}
        <Cena03Modelos className={`${s.cap} ${s.modelos}`}>
          <div className={s.modelosPalco}>
            <div className={s.trilho} data-trilho data-cursor="ARRASTE">
              <div className={s.plateIntro} data-plate-intro>
                <Eyebrow num="03">Projetos</Eyebrow>
                <h2 className={s.plateIntroTitulo}>
                  Cinco nichos. Cinco sites completos, navegáveis agora.
                </h2>
                <p className={s.plateIntroDica}>
                  Arraste para percorrer. Cada modelo abre ao vivo, dentro desta
                  página, sem print e sem maquete.
                </p>
              </div>
              <ShowcaseModelos />
            </div>
          </div>
        </Cena03Modelos>

        {/* CAP 03b · PROJETO REAL: o fecho do capítulo Projetos */}
        <CenaProjetoReal className={`${s.cap} ${s.secao}`}>
          <div className={s.miolo}>
            <ProjetoReal />
          </div>
        </CenaProjetoReal>

        {/* CAP 04 · O PORTAL DO DIAGNÓSTICO + PROCESSO */}
        <Cena04Portal className={`${s.cap} ${s.secao}`}>
          <div className={s.miolo}>
            <div className={s.portalPalco} data-portal-palco>
              <div>
                <span className={s.eyebrowCap}>
                  <Eyebrow num="04">Diagnóstico</Eyebrow>
                </span>
                <h2 className={s.tituloCap}>
                  Seis perguntas. Uma estimativa real.
                </h2>
                <p className={s.subCap}>
                  O consultor do estúdio recomenda o caminho certo, calcula a
                  faixa de investimento e o prazo na hora, e envia tudo no seu
                  e-mail com link permanente.
                </p>
              </div>
              <div className={s.portal}>
                <ol className={s.portalPerguntas} data-portal-perguntas>
                  {PERGUNTAS.map((p, i) => (
                    <li key={p} data-portal-pergunta>
                      <span className="num">0{i + 1}</span>
                      <span data-portal-rotulo>{p}</span>
                    </li>
                  ))}
                </ol>
                <div className={s.portalAcao}>
                  <span className={s.anelAcao}>
                    <svg
                      data-portal-anel
                      viewBox="0 0 200 200"
                      aria-hidden="true"
                      style={{ overflow: "visible" }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="97"
                        fill="none"
                        stroke="var(--hairline-forte)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                      {/* trilho invisível e ponto que percorre o anel no scrub */}
                      <path
                        data-portal-orbita
                        d="M100 3 A97 97 0 1 1 99.9 3"
                        fill="none"
                        stroke="none"
                      />
                      <circle
                        data-portal-dot
                        cx="100"
                        cy="3"
                        r="3"
                        fill="var(--ink)"
                        opacity="0"
                      />
                    </svg>
                    <BotaoCircular href="/diagnostico" cursor="INICIAR">
                      Iniciar diagnóstico
                    </BotaoCircular>
                  </span>
                  <span className="label">Dois minutos, sem compromisso</span>
                </div>
              </div>
            </div>

            <div className={s.passos} data-passos>
              {PASSOS.map((p, i) => (
                <PassoProcesso
                  key={p.titulo}
                  num={`0${i + 1}`}
                  titulo={p.titulo}
                  texto={p.texto}
                  entregaveis={p.entregaveis}
                  figura={p.figura}
                  picto={PICTOS_PASSOS[i]}
                />
              ))}
            </div>
          </div>
        </Cena04Portal>

        {/* CAP 05 · O ESTÚDIO */}
        <Cena05Estudio className={`${s.cap} ${s.secao}`}>
          <div className={s.miolo}>
            <span className={s.eyebrowCap}>
              <Eyebrow num="05">Estúdio</Eyebrow>
            </span>
            <h2 className={s.tituloCap}>Assinado por quem constrói.</h2>
            <div className={s.fatos}>
              {FATOS.map((f) => (
                <div className={s.fato} key={f.rotulo} data-fato>
                  <span className={s.fatoNumero} data-fato-numero>
                    {f.numero}
                    {f.sufixo}
                  </span>
                  <span className={s.fatoRotulo} data-fato-rotulo>
                    {f.rotulo}
                  </span>
                </div>
              ))}
            </div>
            <Figura
              src="/fotos/estudio-faixa.avif"
              alt="Bancada de trabalho na penumbra, iluminada por uma única luminária"
              ratio="21 / 9"
              sizes="(max-width: 860px) 100vw, 1480px"
              parallax={0.6}
              direcao="esquerda"
              legenda="A bancada, tarde da noite"
              className={s.estudioFaixa}
            />
            <div className={s.principios}>
              {PRINCIPIOS.map((p, i) => (
                <figure className={s.principio} key={p} data-principio>
                  <blockquote>{p}</blockquote>
                  {i === 0 && (
                    <svg
                      className={s.rubrica}
                      data-rubrica
                      viewBox="0 0 140 2"
                      aria-hidden="true"
                    >
                      <line
                        x1="0"
                        y1="1"
                        x2="140"
                        y2="1"
                        stroke="var(--warm)"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}
                  <figcaption className={s.principioAssinatura}>
                    <span className="monograma" aria-hidden="true">
                      A
                    </span>
                    Matheus de Andrade · Fundador
                  </figcaption>
                </figure>
              ))}
            </div>
            <EstudioAoVivo />
          </div>
        </Cena05Estudio>

        {/* CAP 07 (eyebrow 06) · BASTIDORES: a prova de engenharia */}
        <Cena07Bastidores className={`${s.cap} ${s.secao}`}>
          <div className={s.miolo}>
            <span className={s.eyebrowCap}>
              <Eyebrow num="06">Bastidores</Eyebrow>
            </span>
            <h2 className={s.tituloCap}>Este site é o portfólio.</h2>
            <p className={s.subCap}>
              Antes de vender um padrão, o estúdio aplicou o padrão em si mesmo.
              O que você está navegando agora é a prova de engenharia.
            </p>
            <Bastidores />
            <FichaTecnica />
          </div>
        </Cena07Bastidores>

        {/* CAP 08 (eyebrow 07) · INVESTIMENTO + FAQ */}
        <Cena06Investimento className={`${s.cap} ${s.secao}`}>
          <div className={s.miolo}>
            <span className={s.eyebrowCap}>
              <Eyebrow num="07">Investimento</Eyebrow>
            </span>
            <h2 className={s.tituloCap}>O preço acompanha o caminho.</h2>
            <div className={s.planos}>
              {PLANOS.map((p) => (
                <div
                  className={s.plano}
                  key={p.nome}
                  data-plano
                  data-destaque={p.destaque || undefined}
                >
                  <span className={s.planoNome}>
                    {p.nome}
                    {p.destaque ? (
                      <span className={s.planoTag}>Recomendado</span>
                    ) : null}
                  </span>
                  <span className={s.planoPreco}>
                    <span className="label">a partir de</span>
                    <span className={s.planoValor} data-plano-valor>
                      {p.valor}
                    </span>
                    <span className={s.planoPrazo}>{p.prazo}</span>
                  </span>
                  <span className={s.planoItens}>{p.itens}</span>
                  {p.cta === "diagnostico" ? (
                    <BotaoLinha compacto href="/diagnostico" cursor="INICIAR">
                      Começar
                    </BotaoLinha>
                  ) : (
                    <BotaoLinha
                      compacto
                      href={WHATSAPP_AVANCADO}
                      externo
                      cursor="ABRIR"
                    >
                      Falar no WhatsApp
                    </BotaoLinha>
                  )}
                </div>
              ))}
            </div>
            <div className={s.risco}>
              <p className={s.riscoTexto}>
                <strong>Você vê antes de decidir.</strong> Aprova a prévia
                navegável do seu site antes de seguir, com uma rodada de ajuste
                inclusa. O código e o domínio saem no seu nome, nada fica refém.
              </p>
            </div>
            <p className={s.planosNota}>
              Valores de partida. A estimativa do seu projeto sai na hora, no
              diagnóstico.
            </p>

            <Garantias />

            <div className={s.faq}>
              <span className="label">Dúvidas frequentes</span>
              <Accordion itens={FAQ} />
            </div>
          </div>
        </Cena06Investimento>

        {/* CODA · CONTATO + FOOTER */}
        <CenaCoda className={`${s.cap} ${s.codaFim}`}>
          {/* horizonte noturno atrás da coda: o único âmbar generoso, da foto */}
          <div className={s.codaFoto} aria-hidden="true">
            <Figura
              src="/fotos/coda-horizonte.avif"
              alt=""
              ratio="21 / 9"
              sizes="100vw"
              parallax={-0.6}
              reveal="nenhum"
              veu="vertical"
            />
          </div>
          <div className="nevoa nevoa--lenta" aria-hidden="true" />
          <div className={s.coda}>
            <h2 className={s.codaTitulo} data-coda-titulo>
              Vamos construir o seu?
            </h2>
            <div className={s.codaAcoes} data-coda-acao>
              <span className={s.anelAcao}>
                <svg
                  data-coda-anel
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                  style={{ overflow: "visible" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="97"
                    fill="none"
                    stroke="var(--hairline-forte)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* o único âmbar em movimento: um ponto orbitando o anel */}
                  <path
                    data-coda-orbita
                    d="M100 3 A97 97 0 1 1 99.9 3"
                    fill="none"
                    stroke="none"
                  />
                  <circle
                    data-coda-dot
                    cx="100"
                    cy="3"
                    r="2.5"
                    fill="var(--warm)"
                    opacity="0"
                  />
                </svg>
                <Magnetico>
                  <BotaoCircular href="/diagnostico" cursor="INICIAR">
                    Iniciar diagnóstico
                  </BotaoCircular>
                </Magnetico>
              </span>
              <span data-evento="whatsapp_click">
                <BotaoLinha href={WHATSAPP} externo cursor="ABRIR">
                  Conversar no WhatsApp
                </BotaoLinha>
              </span>
            </div>
            <EstudioAoVivo className={s.codaAoVivo} />
          </div>

          <footer className={s.rodape}>
            <div className={s.rodapeGrid}>
              <div className={s.rodapeMarca} data-rodape-bloco>
                <span className="cab-wordmark">A N D R A D E</span>
                <p className={s.rodapeTagline}>
                  Estúdio digital. Sites e plataformas com design e código
                  autorais, assinados por quem constrói.
                </p>
              </div>
              <div className={s.rodapeCol} data-rodape-bloco>
                <span className={`label ${s.rodapeTituloCol}`}>Navegação</span>
                <a href="#cap-abertura" data-rolar="#cap-abertura">
                  Início
                </a>
                <a href="#cap-caminhos" data-rolar="#cap-caminhos">
                  Soluções
                </a>
                <a href="#cap-modelos" data-rolar="#cap-modelos">
                  Projetos
                </a>
                <Link href="/diagnostico">Diagnóstico</Link>
                <a href="#cap-investimento" data-rolar="#cap-investimento">
                  Investimento
                </a>
              </div>
              <div className={s.rodapeCol} data-rodape-bloco>
                <span className={`label ${s.rodapeTituloCol}`}>Modelos</span>
                <Link href="/demos/brasa">BRASA</Link>
                <Link href="/demos/vitta">VITTA</Link>
                <Link href="/demos/foro">FORO</Link>
                <Link href="/demos/prumo">PRUMO</Link>
                <Link href="/demos/solar">SOLAR</Link>
              </div>
              <div className={s.rodapeCol} data-rodape-bloco>
                <span className={`label ${s.rodapeTituloCol}`}>Contato</span>
                <a
                  className={s.rodapePill}
                  href={`mailto:${EMAIL}`}
                  data-evento="email_click"
                >
                  <span>{EMAIL}</span>
                  <span className={s.rodapePillAro} aria-hidden="true">
                    <IcoSetaDireita size={13} />
                  </span>
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-evento="whatsapp_click"
                >
                  WhatsApp
                </a>
                <a
                  href="https://github.com/mafulldev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <span className={s.rodapeLocal}>
                  Sumaré SP · atendimento remoto em todo o Brasil
                </span>
              </div>
            </div>
            <div
              className={s.rodapeWordmark}
              data-rodape-wordmark
              aria-hidden="true"
            >
              <span>ANDRADE,</span>
            </div>
            <div className={s.rodapeBase}>
              <span className="label">
                © 2026 ANDRADE, Estúdio digital. Projetado, construído e
                automatizado pelo próprio estúdio.
              </span>
              <span className={s.rodapeAtalho} aria-hidden="true">
                Ctrl K abre a navegação rápida
              </span>
              <span className={s.rodapeBaseDir}>
                <Link href="/privacidade">Privacidade</Link>
                <span className="monograma" aria-hidden="true">
                  A
                </span>
              </span>
            </div>
          </footer>
        </CenaCoda>
      </main>
    </>
  );
}

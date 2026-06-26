"use client";

// O consultor do estúdio: seis perguntas, transições mascaradas, rail de
// briefing editável, teclado completo, aria-live, varredura de luz única
// na revelação do resultado. SOLACE: header do estúdio, linhas hairline,
// névoa ambiente no lugar do shader.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import { BotaoCircular, BotaoLinha } from "@/components/Botoes";
import { CampoCheck, CampoLinha } from "@/components/Campos";
import { mostrarToast } from "@/components/Toast";
import {
  IcoCheckCircular,
  IcoLosango,
  IcoSetaDireita,
} from "@/components/Icones";
import { trackEvento } from "@/lib/eventos";
import {
  avaliar,
  DISCLAIMER,
  type Avaliacao,
  type Funcionalidade,
  type Investimento,
  type Objetivo,
  type Prazo,
  type Respostas,
  type Segmento,
} from "@/lib/motor";
import {
  dataPorExtenso,
  faixaPorExtenso,
  ROTULO_CAMINHO,
  ROTULO_FUNC,
  ROTULO_INVEST,
  ROTULO_OBJETIVO,
  ROTULO_PRAZO,
  ROTULO_SEGMENTO,
} from "@/lib/rotulos";
import s from "@/app/diagnostico/diagnostico.module.css";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      execute: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const WHATSAPP_NUMERO = "5519971460099";

const ASSINATURA = `
.---------------------------------------------.
|   A  N  D  R  A  D  E   ·   Diagnóstico     |
|   Seis perguntas. Um caminho.               |
'---------------------------------------------'`;

type PerguntaSimples = {
  tipo: "simples";
  chave: "segmento" | "objetivo" | "prazo" | "invest";
  titulo: string;
  opcoes: { valor: string; rotulo: string }[];
};

type PerguntaMulti = {
  tipo: "multi";
  chave: "func";
  titulo: string;
  dica: string;
  opcoes: { valor: Funcionalidade; rotulo: string }[];
};

const PERGUNTAS: (PerguntaSimples | PerguntaMulti)[] = [
  {
    tipo: "simples",
    chave: "segmento",
    titulo: "Qual é o seu segmento?",
    opcoes: Object.entries(ROTULO_SEGMENTO).map(([valor, rotulo]) => ({
      valor,
      rotulo,
    })),
  },
  {
    tipo: "simples",
    chave: "objetivo",
    titulo: "Qual é o objetivo principal?",
    opcoes: Object.entries(ROTULO_OBJETIVO).map(([valor, rotulo]) => ({
      valor,
      rotulo,
    })),
  },
  {
    tipo: "multi",
    chave: "func",
    titulo: "O que o projeto precisa ter?",
    dica: "Selecione tudo que se aplica, ou avance sem marcar.",
    opcoes: (Object.entries(ROTULO_FUNC) as [Funcionalidade, string][]).map(
      ([valor, rotulo]) => ({ valor, rotulo }),
    ),
  },
  {
    tipo: "simples",
    chave: "prazo",
    titulo: "Para quando?",
    opcoes: Object.entries(ROTULO_PRAZO).map(([valor, rotulo]) => ({
      valor,
      rotulo,
    })),
  },
  {
    tipo: "simples",
    chave: "invest",
    titulo: "Quanto pretende investir?",
    opcoes: Object.entries(ROTULO_INVEST).map(([valor, rotulo]) => ({
      valor,
      rotulo,
    })),
  },
];

type EstadoRespostas = {
  segmento?: Segmento;
  objetivo?: Objetivo;
  func: Funcionalidade[];
  prazo?: Prazo;
  invest?: Investimento;
};

type Resultado = {
  aval: Avaliacao;
  id: string | null;
  numero: number | null;
  data: Date;
  emailEnviado: boolean;
};

const CUSTOM_FUNCS: Funcionalidade[] = [
  "pagamentos",
  "membros",
  "integracoes",
  "admin",
];

function justificar(r: Respostas, aval: Avaliacao): string[] {
  const j: string[] = [];
  if (aval.caminho === "sobmedida") {
    const custom = r.func.filter((f) => CUSTOM_FUNCS.includes(f));
    if (r.objetivo === "sistema") {
      j.push(
        "Um sistema interno nasce melhor desenhado do zero, com arquitetura própria.",
      );
    }
    if (custom.length > 0) {
      j.push(
        `Funcionalidades como ${custom
          .map((f) => ROTULO_FUNC[f].toLowerCase())
          .join(", ")} pedem engenharia própria.`,
      );
    }
    if (r.prazo === "urgente") {
      j.push(
        "A urgência entra no cálculo: construção dedicada com prazo comprimido.",
      );
    }
    if (j.length < 2) {
      j.push(
        "O objetivo declarado pede mais que presença: estrutura desenhada para o negócio.",
      );
    }
  } else {
    if (r.prazo === "urgente") {
      j.push(
        "Seu prazo pede velocidade: o modelo pronto entra no ar em até um dia útil.",
      );
    }
    if (r.invest === "ate2500") {
      j.push(
        "O investimento indicado cabe no caminho pronto sem abrir mão de acabamento.",
      );
    }
    if (r.objetivo === "presenca") {
      j.push(
        "Para credibilidade imediata, o modelo refinado resolve com elegância.",
      );
    }
    if (j.length < 2) {
      j.push(
        "Sem funcionalidades de engenharia própria, o pronto entrega mais valor por real investido.",
      );
    }
  }
  return j.slice(0, 3);
}

function montarEscopo(r: Respostas, aval: Avaliacao): string[] {
  const base = {
    pronto: "Modelo do nicho refinado, com a sua marca aplicada",
    institucional: "Site institucional desenhado do zero",
    ecommerce: "Loja online completa, do catálogo ao pedido",
    sistema: "Sistema com arquitetura própria",
  }[aval.categoria];

  const itens = [base, ...r.func.map((f) => ROTULO_FUNC[f])];
  if (aval.categoria === "ecommerce" && !r.func.includes("pagamentos")) {
    itens.push("Pagamentos online, já incluso na categoria");
  }
  if (aval.categoria === "sistema" && !r.func.includes("admin")) {
    itens.push("Painel administrativo, já incluso na categoria");
  }
  itens.push("Responsivo, SEO técnico e acessibilidade essencial");
  return itens;
}

function useTurnstile() {
  const slotRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const resolverRef = useRef<((t: string | null) => void) | null>(null);

  useEffect(() => {
    if (!SITEKEY) return;
    const montar = () => {
      if (!window.turnstile || !slotRef.current || widgetRef.current) return;
      widgetRef.current = window.turnstile.render(slotRef.current, {
        sitekey: SITEKEY,
        execution: "execute",
        callback: (token: string) => {
          resolverRef.current?.(token);
          resolverRef.current = null;
        },
        "error-callback": () => {
          resolverRef.current?.(null);
          resolverRef.current = null;
        },
      });
    };
    if (window.turnstile) {
      montar();
      return;
    }
    const existente = document.getElementById("turnstile-api");
    if (existente) {
      existente.addEventListener("load", montar);
      return;
    }
    const script = document.createElement("script");
    script.id = "turnstile-api";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = montar;
    document.head.appendChild(script);
  }, []);

  const obterToken = useCallback(() => {
    return new Promise<string | null>((resolver) => {
      if (!SITEKEY || !window.turnstile || !widgetRef.current) {
        resolver(null);
        return;
      }
      resolverRef.current = resolver;
      try {
        window.turnstile.execute(widgetRef.current);
      } catch {
        resolver(null);
        resolverRef.current = null;
      }
      window.setTimeout(() => {
        if (resolverRef.current) {
          resolverRef.current(null);
          resolverRef.current = null;
        }
      }, 8000);
    });
  }, []);

  return { slotRef, obterToken };
}

export default function Consultor() {
  const [etapa, setEtapa] = useState(0); // 0..4 perguntas, 5 identificação, 6 resultado
  const [respostas, setRespostas] = useState<EstadoRespostas>({ func: [] });
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [contatoTipo, setContatoTipo] = useState<"whatsapp" | "email">(
    "whatsapp",
  );
  const [contato, setContato] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [hp, setHp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [aberturaFim, setAberturaFim] = useState(false);
  const [emailExtra, setEmailExtra] = useState("");
  const [consentExtra, setConsentExtra] = useState(false);
  const [mostraFormEmail, setMostraFormEmail] = useState(false);

  const paginaRef = useRef<HTMLDivElement>(null);
  const cartaoRef = useRef<HTMLDivElement>(null);
  const inicioRef = useRef(Date.now());
  const { slotRef, obterToken } = useTurnstile();

  const reduzido = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // eventos de chegada e assinatura do estúdio no console
  useEffect(() => {
    trackEvento("diagnostico_iniciado");
    console.log(
      `%c${ASSINATURA}`,
      "color: oklch(0.8 0.11 88); font-family: monospace;",
    );
  }, []);

  // abertura própria de 1.2s, no padrão useGSAP com cleanup automático
  useGSAP(
    () => {
      if (reduzido()) {
        setAberturaFim(true);
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setAberturaFim(true) });
      tl.fromTo(
        "[data-abertura-rotulo]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "andrade" },
        0,
      )
        .to(
          "[data-abertura-traco]",
          { scaleX: 1, duration: 0.6, ease: "andrade" },
          0.15,
        )
        .to(
          "[data-abertura]",
          { clipPath: "inset(0 0 100% 0)", duration: 0.45, ease: "andrade" },
          0.75,
        );
    },
    { scope: paginaRef },
  );

  // transição mascarada de entrada a cada etapa; na revelação do resultado,
  // a varredura de luz cruza o caminho recomendado uma única vez
  useLayoutEffect(() => {
    const el = cartaoRef.current;
    if (!el || reduzido()) return;
    const tweens: gsap.core.Tween[] = [];
    tweens.push(
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease: "andrade" },
      ),
    );
    if (etapa === 6) {
      const luz = el.querySelector("[data-varrer-resultado]");
      if (luz) {
        tweens.push(
          gsap.fromTo(
            luz,
            { xPercent: -130 },
            { xPercent: 130, duration: 1.6, ease: "andrade", delay: 0.45 },
          ),
        );
      }
    }
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [etapa]);

  const irPara = useCallback((nova: number) => {
    const el = cartaoRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEtapa(nova);
      return;
    }
    gsap.to(el, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "andrade",
      onComplete: () => setEtapa(nova),
    });
  }, []);

  const responderSimples = (chave: PerguntaSimples["chave"], valor: string) => {
    if (selecionada) return;
    setRespostas((r) => ({ ...r, [chave]: valor }));
    setSelecionada(valor);
    window.setTimeout(() => {
      setSelecionada(null);
      trackEvento("etapa_concluida", { etapa: etapa + 1 });
      irPara(etapa + 1);
    }, 360);
  };

  const alternarFunc = (valor: Funcionalidade) => {
    setRespostas((r) => ({
      ...r,
      func: r.func.includes(valor)
        ? r.func.filter((f) => f !== valor)
        : [...r.func, valor],
    }));
  };

  const avancarMulti = () => {
    trackEvento("etapa_concluida", { etapa: etapa + 1 });
    irPara(etapa + 1);
  };

  const aoTeclarOpcoes = (e: KeyboardEvent<HTMLDivElement>) => {
    const alvos = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-opcao]"),
    );
    const idx = alvos.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      (alvos[idx + 1] ?? alvos[0])?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      (alvos[idx - 1] ?? alvos[alvos.length - 1])?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      alvos[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      alvos[alvos.length - 1]?.focus();
    } else if (/^[1-9]$/.test(e.key)) {
      const n = Number(e.key) - 1;
      alvos[n]?.click();
    }
  };

  const concluir = async (comContato: boolean) => {
    if (enviando) return;
    const r = respostas;
    if (!r.segmento || !r.objetivo || !r.prazo || !r.invest) return;
    const completas: Respostas = {
      segmento: r.segmento,
      objetivo: r.objetivo,
      func: r.func,
      prazo: r.prazo,
      invest: r.invest,
    };

    if (comContato) {
      if (!contato.trim()) {
        mostrarToast("Informe um contato ou escolha ver sem contato.");
        return;
      }
      if (
        contatoTipo === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contato.trim())
      ) {
        mostrarToast("Confira o e-mail informado.");
        return;
      }
      if (
        contatoTipo === "whatsapp" &&
        contato.replace(/\D/g, "").length < 10
      ) {
        mostrarToast("Confira o número de WhatsApp, com DDD.");
        return;
      }
      if (!consentimento) {
        mostrarToast(
          "Marque o consentimento para receber o contato do estúdio.",
        );
        return;
      }
    }

    setEnviando(true);
    const avalLocal = avaliar(completas);
    const token = comContato ? await obterToken() : null;

    let res: Resultado = {
      aval: avalLocal,
      id: null,
      numero: null,
      data: new Date(),
      emailEnviado: false,
    };

    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          respostas: completas,
          nome: nome.trim() || null,
          contato: comContato ? contato.trim() : null,
          contatoTipo: comContato ? contatoTipo : null,
          consentimento: comContato ? consentimento : false,
          duracaoMs: Date.now() - inicioRef.current,
          website: hp,
          turnstileToken: token,
          origem: "diagnostico",
        }),
      });
      if (resposta.ok) {
        const dados = (await resposta.json()) as {
          id: string | null;
          numero: number | null;
          criadoEm: string;
          caminho: Avaliacao["caminho"];
          categoria: Avaliacao["categoria"];
          faixaMin: number;
          faixaMax: number;
          prazoEstimado: string;
        };
        res = {
          aval: {
            caminho: dados.caminho,
            categoria: dados.categoria,
            faixaMin: dados.faixaMin,
            faixaMax: dados.faixaMax,
            prazoEstimado: dados.prazoEstimado,
          },
          id: dados.id,
          numero: dados.numero,
          data: new Date(dados.criadoEm),
          emailEnviado: comContato && contatoTipo === "email",
        };
      }
    } catch {
      // sem rede ou sem banco: o resultado local vale para o visitante
    }

    setResultado(res);
    setEnviando(false);
    trackEvento(
      "resultado_gerado",
      {
        caminho: res.aval.caminho,
        faixaMin: res.aval.faixaMin,
        faixaMax: res.aval.faixaMax,
      },
      res.id ?? undefined,
    );
    irPara(6);
  };

  const refazer = () => {
    setRespostas({ func: [] });
    setNome("");
    setContato("");
    setConsentimento(false);
    setResultado(null);
    setMostraFormEmail(false);
    irPara(0);
  };

  const enviarEmailExtra = async () => {
    if (!resultado?.id) {
      mostrarToast("Envio por e-mail indisponível nesta sessão.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailExtra.trim())) {
      mostrarToast("Confira o e-mail informado.");
      return;
    }
    if (!consentExtra) {
      mostrarToast("Marque o consentimento para receber o e-mail.");
      return;
    }
    trackEvento("email_click", { origem: "resultado" }, resultado.id);
    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          acao: "email",
          id: resultado.id,
          email: emailExtra.trim(),
          consentimento: consentExtra,
        }),
      });
      if (resposta.ok) {
        mostrarToast("Estimativa enviada para o seu e-mail.");
        setMostraFormEmail(false);
      } else {
        mostrarToast("Não foi possível enviar agora. Tente de novo.");
      }
    } catch {
      mostrarToast("Não foi possível enviar agora. Tente de novo.");
    }
  };

  const copiarLink = async () => {
    if (!resultado?.id) {
      mostrarToast("Link permanente indisponível nesta sessão.");
      return;
    }
    const url = `${window.location.origin}/estimativa/${resultado.id}`;
    try {
      await navigator.clipboard.writeText(url);
      trackEvento("link_copiado", {}, resultado.id);
      mostrarToast("Link copiado.");
    } catch {
      mostrarToast(url);
    }
  };

  const linkWhatsApp = (): string => {
    if (!resultado) return `https://wa.me/${WHATSAPP_NUMERO}`;
    const r = respostas;
    const lista = r.func.length
      ? r.func.map((f) => ROTULO_FUNC[f]).join(", ")
      : "nenhuma específica";
    const msg =
      `Olá, Matheus. Sou ${nome.trim() || "visitante do site"}. ` +
      `Diagnóstico Nº ${resultado.numero ?? "recente"}: ` +
      `segmento ${r.segmento ? ROTULO_SEGMENTO[r.segmento] : ""}, ` +
      `objetivo ${r.objetivo ? ROTULO_OBJETIVO[r.objetivo] : ""}, ` +
      `funcionalidades ${lista}, prazo ${r.prazo ? ROTULO_PRAZO[r.prazo] : ""}. ` +
      `Estimativa apresentada: ${faixaPorExtenso(resultado.aval.faixaMin, resultado.aval.faixaMax)}. ` +
      `Quero receber a proposta detalhada.`;
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
  };

  // rail de briefing: o documento vivo
  const briefing: { rotulo: string; valor: string; etapaIdx: number }[] = [];
  if (respostas.segmento)
    briefing.push({
      rotulo: "Segmento",
      valor: ROTULO_SEGMENTO[respostas.segmento],
      etapaIdx: 0,
    });
  if (respostas.objetivo)
    briefing.push({
      rotulo: "Objetivo",
      valor: ROTULO_OBJETIVO[respostas.objetivo],
      etapaIdx: 1,
    });
  if (etapa > 2)
    briefing.push({
      rotulo: "Funcionalidades",
      valor: respostas.func.length
        ? respostas.func.map((f) => ROTULO_FUNC[f]).join(", ")
        : "Nenhuma específica",
      etapaIdx: 2,
    });
  if (respostas.prazo)
    briefing.push({
      rotulo: "Prazo",
      valor: ROTULO_PRAZO[respostas.prazo],
      etapaIdx: 3,
    });
  if (respostas.invest)
    briefing.push({
      rotulo: "Investimento",
      valor: ROTULO_INVEST[respostas.invest],
      etapaIdx: 4,
    });

  const progresso = Math.min(etapa, 6) / 6;
  const pergunta = etapa < 5 ? PERGUNTAS[etapa] : null;

  return (
    <div className={s.pagina} ref={paginaRef}>
      <div className="nevoa nevoa--lenta" aria-hidden="true" />

      {!aberturaFim && (
        <div className={s.abertura} data-abertura aria-hidden="true">
          <div className={s.aberturaMiolo}>
            <span className="label" data-abertura-rotulo>
              Diagnóstico
            </span>
            <span className={s.aberturaTraco} data-abertura-traco />
          </div>
        </div>
      )}

      <Header />

      <p className="visualmente-oculto" aria-live="polite">
        {etapa < 5 && pergunta
          ? `Pergunta ${etapa + 1} de 6: ${pergunta.titulo}`
          : etapa === 5
            ? "Pergunta 6 de 6: identificação"
            : "Resultado do diagnóstico pronto."}
      </p>

      <main id="conteudo" className={s.corpo}>
        <div className={s.progresso}>
          <span className="label">
            {etapa < 6 ? `0${etapa + 1} / 06` : "06 / 06"}
          </span>
          <div className={s.progressoLinha}>
            <span
              style={{ transform: `scaleX(${Math.max(progresso, 0.02)})` }}
            />
          </div>
        </div>

        <div className={s.cartao} ref={cartaoRef}>
          {/* perguntas 1 a 5 */}
          {pergunta && (
            <>
              <h1 className={s.pergunta}>{pergunta.titulo}</h1>
              {pergunta.tipo === "multi" && (
                <p className={s.dica}>{pergunta.dica}</p>
              )}
              <div
                className={s.opcoes}
                role="group"
                aria-label={pergunta.titulo}
                onKeyDown={aoTeclarOpcoes}
              >
                {pergunta.opcoes.map((o, idx) => {
                  const marcada =
                    pergunta.tipo === "multi" &&
                    respostas.func.includes(o.valor as Funcionalidade);
                  return (
                    <button
                      key={o.valor}
                      type="button"
                      data-opcao
                      className={`${s.opcao} ${selecionada === o.valor ? s.opcaoSelecionada : ""} ${marcada ? s.opcaoMarcada : ""}`}
                      aria-pressed={
                        pergunta.tipo === "multi" ? marcada : undefined
                      }
                      onClick={() =>
                        pergunta.tipo === "multi"
                          ? alternarFunc(o.valor as Funcionalidade)
                          : responderSimples(pergunta.chave, o.valor)
                      }
                    >
                      <span className={s.opcaoTexto}>
                        <span className={s.opcaoNum} aria-hidden="true">
                          {idx + 1}
                        </span>
                        {o.rotulo}
                      </span>
                      {marcada ? (
                        <IcoCheckCircular size={17} />
                      ) : (
                        <IcoSetaDireita size={15} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className={s.acoesEtapa}>
                {etapa > 0 && (
                  <button
                    type="button"
                    className={s.voltar}
                    onClick={() => irPara(etapa - 1)}
                  >
                    Voltar
                  </button>
                )}
                {pergunta.tipo === "multi" && (
                  <BotaoLinha onClick={avancarMulti}>Avançar</BotaoLinha>
                )}
              </div>
            </>
          )}

          {/* etapa 6: identificação */}
          {etapa === 5 && (
            <>
              <h1 className={s.pergunta}>Para quem é a estimativa?</h1>
              <p className={s.dica}>
                A estimativa aparece mesmo sem contato. Envio por e-mail e
                acompanhamento exigem contato e consentimento.
              </p>
              <div className={s.formIdent}>
                <CampoLinha
                  rotulo="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="name"
                />
                <div
                  className={s.tipoContato}
                  role="group"
                  aria-label="Tipo de contato"
                >
                  <button
                    type="button"
                    className={`${s.pill} ${contatoTipo === "whatsapp" ? s.pillAtiva : ""}`}
                    aria-pressed={contatoTipo === "whatsapp"}
                    onClick={() => setContatoTipo("whatsapp")}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    className={`${s.pill} ${contatoTipo === "email" ? s.pillAtiva : ""}`}
                    aria-pressed={contatoTipo === "email"}
                    onClick={() => setContatoTipo("email")}
                  >
                    E-mail
                  </button>
                </div>
                <CampoLinha
                  rotulo={
                    contatoTipo === "whatsapp"
                      ? "WhatsApp com DDD"
                      : "Seu e-mail"
                  }
                  type={contatoTipo === "whatsapp" ? "tel" : "email"}
                  inputMode={contatoTipo === "whatsapp" ? "tel" : "email"}
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  autoComplete={contatoTipo === "whatsapp" ? "tel" : "email"}
                />
                <CampoCheck
                  rotulo="Autorizo o contato do estúdio sobre esta estimativa."
                  checked={consentimento}
                  onChange={(e) => setConsentimento(e.target.checked)}
                />

                {/* honeypot: humanos não veem nem preenchem */}
                <div className={s.hp} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                  />
                </div>
                <div ref={slotRef} />

                <div className={s.acoesEtapa}>
                  <BotaoCircular
                    cheio
                    cursor="INICIAR"
                    onClick={() => concluir(true)}
                  >
                    {enviando ? "Calculando" : "Ver minha estimativa"}
                  </BotaoCircular>
                  <button
                    type="button"
                    className={s.voltar}
                    onClick={() => concluir(false)}
                    disabled={enviando}
                  >
                    Ver sem deixar contato
                  </button>
                </div>
                <button
                  type="button"
                  className={s.voltar}
                  onClick={() => irPara(4)}
                >
                  Voltar
                </button>
              </div>
            </>
          )}

          {/* resultado: a mini-proposta */}
          {etapa === 6 && resultado && (
            <div className={s.resultado}>
              <div className={s.resCabecalho}>
                <span className="label">
                  Diagnóstico {dataPorExtenso(resultado.data)}
                </span>
                {resultado.numero !== null && (
                  <span className={s.resNumero}>Nº {resultado.numero}</span>
                )}
              </div>

              <div className={s.resBloco}>
                <span className="label">Caminho recomendado</span>
                <div className="varredura">
                  <h1 className={s.resCaminho}>
                    {ROTULO_CAMINHO[resultado.aval.caminho]}
                  </h1>
                  <span
                    className="varredura-luz"
                    data-varrer-resultado
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className={s.resBloco}>
                <span className="label">Por quê</span>
                <ul className={s.resLista}>
                  {justificar(respostas as Respostas, resultado.aval).map(
                    (t) => (
                      <li key={t}>
                        <IcoLosango size={10} />
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className={s.resBloco}>
                <span className="label">Escopo estimado</span>
                <ul className={s.resLista}>
                  {montarEscopo(respostas as Respostas, resultado.aval).map(
                    (t) => (
                      <li key={t}>
                        <IcoCheckCircular size={14} />
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className={s.resBloco}>
                <span className="label">Investimento estimado</span>
                <p className={s.resFaixa}>
                  {faixaPorExtenso(
                    resultado.aval.faixaMin,
                    resultado.aval.faixaMax,
                  )}
                </p>
                <p className={s.resDisclaimer}>{DISCLAIMER}</p>
              </div>

              <div className={s.resBloco}>
                <span className="label">Prazo estimado</span>
                <p>{resultado.aval.prazoEstimado}</p>
              </div>

              <div className={s.resAcoes}>
                <a
                  className="botao-linha"
                  href={linkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="ABRIR"
                  onClick={() =>
                    trackEvento(
                      "whatsapp_click",
                      { origem: "resultado" },
                      resultado.id ?? undefined,
                    )
                  }
                >
                  <span>Receber proposta no WhatsApp</span>
                  <IcoSetaDireita size={14} />
                </a>
                <button
                  type="button"
                  className="botao-linha"
                  onClick={() => {
                    if (resultado.emailEnviado) {
                      mostrarToast(
                        "A estimativa já foi enviada para o seu e-mail.",
                      );
                    } else {
                      setMostraFormEmail((v) => !v);
                    }
                  }}
                >
                  <span>Receber por e-mail</span>
                  <IcoSetaDireita size={14} />
                </button>
                <button
                  type="button"
                  className="botao-linha"
                  onClick={() => {
                    trackEvento("pdf_click", {}, resultado.id ?? undefined);
                    window.print();
                  }}
                >
                  <span>Salvar em PDF</span>
                  <IcoSetaDireita size={14} />
                </button>
                <button
                  type="button"
                  className="botao-linha"
                  onClick={copiarLink}
                >
                  <span>Copiar link</span>
                  <IcoSetaDireita size={14} />
                </button>
                <button type="button" className={s.voltar} onClick={refazer}>
                  Refazer
                </button>
              </div>

              {mostraFormEmail && (
                <div className={s.formEmailExtra}>
                  <CampoLinha
                    rotulo="Seu e-mail"
                    type="email"
                    inputMode="email"
                    value={emailExtra}
                    onChange={(e) => setEmailExtra(e.target.value)}
                  />
                  <CampoCheck
                    rotulo="Autorizo o contato do estúdio sobre esta estimativa."
                    checked={consentExtra}
                    onChange={(e) => setConsentExtra(e.target.checked)}
                  />
                  <BotaoLinha onClick={enviarEmailExtra}>
                    Enviar estimativa
                  </BotaoLinha>
                </div>
              )}
            </div>
          )}
        </div>

        {/* rail de briefing: o documento vivo (desktop) */}
        {etapa < 6 && (
          <aside className={s.railBriefing} aria-label="Seu briefing até aqui">
            <span className={`label ${s.railTitulo}`}>Seu briefing</span>
            {briefing.length === 0 && (
              <p className="mudo" style={{ fontSize: 14 }}>
                As respostas vão se escrevendo aqui, como um documento vivo.
              </p>
            )}
            {briefing.map((b) => (
              <div className={s.railItem} key={b.rotulo}>
                <span className="label">{b.rotulo}</span>
                <span className={s.railValor}>{b.valor}</span>
                <button
                  type="button"
                  className={s.railEditar}
                  onClick={() => irPara(b.etapaIdx)}
                >
                  Editar
                </button>
              </div>
            ))}
          </aside>
        )}

        {/* resumo recolhível (mobile) */}
        {etapa < 6 && briefing.length > 0 && (
          <details className={s.resumoMobile}>
            <summary>Seu briefing até aqui</summary>
            {briefing.map((b) => (
              <div className={s.railItem} key={b.rotulo}>
                <span className="label">{b.rotulo}</span>
                <span className={s.railValor}>{b.valor}</span>
                <button
                  type="button"
                  className={s.railEditar}
                  onClick={() => irPara(b.etapaIdx)}
                >
                  Editar
                </button>
              </div>
            ))}
          </details>
        )}
      </main>
    </div>
  );
}

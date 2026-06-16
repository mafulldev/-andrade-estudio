"use client";

// PRUMO, serviços e reforma: one-page de 5 cenas sobre o regime
// compartilhado (useCenaDemo): hero direto com faixa de obra em plate,
// títulos por linha, plates por clip-path com parallax interno.
// Assinatura da demo: slider de comparação ANTES e DEPOIS por clip-path,
// arrastável em mouse e touch (pointer events) e com teclado completo.

import Image from "next/image";
import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as PontoEvento,
} from "react";
import { mostrarToast } from "@/components/Toast";
import { useLenis } from "@/components/LenisProvider";
import { useCenaDemo } from "@/components/demos/useCenaDemo";
import s from "@/app/demos/prumo/prumo.module.css";

const SERVICOS = [
  {
    nome: "Elétrica",
    desc: "Quadros, tomadas, iluminação e laudo de instalação. Sem improviso.",
    prazo: "Visita em até 48h",
  },
  {
    nome: "Hidráulica",
    desc: "Vazamentos, registros, aquecedores e caça-vazamento com equipamento.",
    prazo: "Urgência no mesmo dia",
  },
  {
    nome: "Pintura",
    desc: "Preparo de parede de verdade e quantidade de tinta contada por escrito.",
    prazo: "Orçamento em 24h",
  },
  {
    nome: "Reforma completa",
    desc: "Banheiro, cozinha e área externa, do projeto à limpeza final da obra.",
    prazo: "Cronograma assinado",
  },
];

const COMPROMISSOS = [
  { titulo: "Horário é horário", texto: "Se a equipe atrasar mais de quinze minutos, você é avisado antes." },
  { titulo: "Orçamento fechado é orçamento cumprido", texto: "Mudou o escopo? Novo orçamento por escrito antes de continuar." },
  { titulo: "Obra limpa todos os dias", texto: "A casa fica habitável ao fim de cada dia de trabalho." },
  { titulo: "Garantia por escrito", texto: "Noventa dias de garantia em todo serviço, no papel e assinada." },
];

const REGIOES = ["Centro", "Cambuí", "Taquaral", "Barão Geraldo", "Valinhos", "Vinhedo", "Sumaré"];

export default function PrumoPagina() {
  const raizRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const arrastandoRef = useRef(false);
  const [pos, setPos] = useState(50);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ nome: "", whatsapp: "", servico: "Elétrica" });
  const { irPara } = useLenis();

  useCenaDemo(raizRef);

  // assinatura: arrasto por pointer events, mouse e touch
  const moverPara = (clientX: number) => {
    const area = sliderRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  };

  const aoApertar = (e: PontoEvento) => {
    arrastandoRef.current = true;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // eventos sintéticos não têm pointer capture; o arrasto segue mesmo assim
    }
    moverPara(e.clientX);
  };

  const aoMover = (e: PontoEvento) => {
    if (!arrastandoRef.current) return;
    moverPara(e.clientX);
  };

  const aoSoltar = () => {
    arrastandoRef.current = false;
  };

  const aoTeclar = (e: KeyboardEvent) => {
    const passo = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPos((p) => Math.max(4, p - passo));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPos((p) => Math.min(96, p + passo));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(4);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(96);
    }
  };

  const pedirOrcamento = (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (form.nome.trim().length < 2) {
      mostrarToast("Diga seu nome para o orçamento.");
      return;
    }
    if (form.whatsapp.replace(/\D/g, "").length < 10) {
      mostrarToast("Confira o WhatsApp, com DDD.");
      return;
    }
    setEnviando(true);
    // demonstração: simula o envio, sem gravar no banco
    window.setTimeout(() => {
      setEnviando(false);
      setForm({ nome: "", whatsapp: "", servico: "Elétrica" });
      mostrarToast("Pedido enviado. Retornamos com horário de visita ainda hoje.");
    }, 800);
  };

  return (
    <div className={s.pagina} ref={raizRef}>
      {/* 1. HERO direto */}
      <section className={s.hero} data-hero data-hero-conjunto>
        <div className={s.heroTopo}>
          <span className={s.wordmark}>PRUMO</span>
          <span className={s.rotulo}>Campinas e região</span>
        </div>
        <span className={s.rotulo} data-hero-item>
          Elétrica · hidráulica · pintura · reforma
        </span>
        <h1 className={`${s.titulo} ${s.heroTitulo}`} data-hero-linhas>
          <span className="linha">
            <span data-linha>Obra feita.</span>
          </span>
          <span className="linha">
            <span data-linha>
              Casa em <em>ordem</em>.
            </span>
          </span>
        </h1>
        <p className={s.heroSub} data-hero-item>
          Equipe própria, orçamento fechado por escrito e obra limpa no fim de
          cada dia. Sem surpresa na conta, sem poeira no sofá.
        </p>
        <div className={s.selos} data-hero-item>
          <span className={s.selo}>Visita em até 48h</span>
          <span className={s.selo}>Orçamento sem taxa</span>
          <span className={s.selo}>Garantia por escrito</span>
        </div>
        <button
          type="button"
          className={s.botaoPrumo}
          data-hero-item
          onClick={() => irPara("#orcamento")}
        >
          Pedir orçamento
        </button>
        <div className={`${s.foto} ${s.heroFaixa}`} data-hero-plate data-parallax>
          <Image
            src="https://picsum.photos/seed/prumo-1/1600/500"
            alt="A equipe em obra, faixa panorâmica"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 1140px"
          />
        </div>
      </section>

      {/* 2. SERVIÇOS */}
      <section className={s.secao} id="servicos">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Serviços
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.2rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>O que a casa resolve.</span>
            </span>
          </h2>
        </div>
        <div className={s.servicos}>
          {SERVICOS.map((sv) => (
            <div className={s.servico} key={sv.nome} data-reveal="mascara">
              <span className={s.servicoNome}>{sv.nome}</span>
              <span className={s.servicoDesc}>{sv.desc}</span>
              <span className={s.servicoPrazo}>{sv.prazo}</span>
            </div>
          ))}
        </div>
        <div className={`${s.foto} ${s.servicosFoto}`} data-reveal="plate" data-parallax>
          <Image
            src="https://picsum.photos/seed/prumo-2/1600/686"
            alt="Bancada de ferramentas organizada da equipe"
            fill
            sizes="(max-width: 860px) 100vw, 1140px"
          />
        </div>
      </section>

      {/* 3. ANTES E DEPOIS — a assinatura */}
      <section className={s.secao} id="antes-depois">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Antes e depois
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.2rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>Arraste e compare.</span>
            </span>
          </h2>
        </div>
        <div data-reveal="mascara">
          <div
            className={s.slider}
            ref={sliderRef}
            onPointerDown={aoApertar}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerCancel={aoSoltar}
          >
            <Image
              src="https://picsum.photos/seed/prumo-4/1600/900"
              alt="A cozinha depois da reforma"
              fill
              sizes="(max-width: 860px) 100vw, 1100px"
            />
            <div
              className={s.camadaAntes}
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Image
                src="https://picsum.photos/seed/prumo-3/1600/900"
                alt="A mesma cozinha antes da reforma"
                fill
                sizes="(max-width: 860px) 100vw, 1100px"
              />
            </div>
            <span className={s.etiquetaAntes}>ANTES</span>
            <span className={s.etiquetaDepois}>DEPOIS</span>
            <div className={s.divisor} style={{ left: `${pos}%` }} aria-hidden="true" />
            <button
              type="button"
              className={s.alca}
              style={{ left: `${pos}%` }}
              role="slider"
              aria-label="Comparar antes e depois"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              onKeyDown={aoTeclar}
            >
              {"< >"}
            </button>
          </div>
          <p className={s.sliderLegenda}>
            Reforma de cozinha em apartamento de 70 metros, executada em doze
            dias úteis com a família morando no imóvel.
          </p>
        </div>
      </section>

      {/* 4. ORÇAMENTO RÁPIDO */}
      <section className={`${s.secao} ${s.orcamento}`} id="orcamento" style={{ maxWidth: "none" }}>
        <div className={s.orcamentoGrid}>
          <div className={s.orcamentoInfo}>
            <span className={s.rotulo} data-reveal="mascara">
              Orçamento rápido
            </span>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.2rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Três campos.</span>
              </span>
              <span className="linha">
                <span data-linha>Um retorno hoje.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              Deixe o essencial e a equipe retorna no mesmo dia com horário de
              visita. O orçamento é gratuito e sai por escrito.
            </p>
            <div className={`${s.foto} ${s.orcamentoFoto}`} data-reveal="plate" data-parallax>
              <Image
                src="https://picsum.photos/seed/prumo-5/1200/750"
                alt="Medição em obra com nível a laser"
                fill
                sizes="(max-width: 860px) 100vw, 520px"
              />
            </div>
          </div>
          <form className={s.orcamentoForm} onSubmit={pedirOrcamento} data-reveal="mascara">
            <label className={s.campoPrumo}>
              <span>Nome</span>
              <input
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>
            <label className={s.campoPrumo}>
              <span>WhatsApp</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </label>
            <label className={s.campoPrumo}>
              <span>O que precisa</span>
              <select
                value={form.servico}
                onChange={(e) => setForm({ ...form, servico: e.target.value })}
              >
                {SERVICOS.map((sv) => (
                  <option key={sv.nome} value={sv.nome}>{sv.nome}</option>
                ))}
              </select>
            </label>
            <div>
              <button type="submit" className={s.botaoPrumo} disabled={enviando}>
                {enviando ? "Enviando" : "Pedir orçamento"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. COBERTURA E COMPROMISSOS */}
      <section className={s.secao} id="cobertura">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Cobertura e compromissos
          </span>
        </div>
        <div className={s.cobertura}>
          <div className={s.coberturaBloco}>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Onde a equipe chega.</span>
              </span>
            </h2>
            <div className={s.regioes} data-reveal="mascara">
              {REGIOES.map((r) => (
                <span className={s.regiao} key={r}>{r}</span>
              ))}
            </div>
            <div className={`${s.foto} ${s.coberturaFoto}`} data-reveal="plate" data-parallax>
              <Image
                src="https://picsum.photos/seed/prumo-6/1200/750"
                alt="A van da equipe estacionada em frente à obra"
                fill
                sizes="(max-width: 860px) 100vw, 480px"
              />
            </div>
            <p style={{ color: "var(--mudo)", fontSize: 15, margin: 0 }} data-reveal="mascara">
              Fora dessas regiões, consulte disponibilidade: obras de reforma
              completa atendem um raio maior mediante agenda.
            </p>
          </div>
          <ul className={s.compromissos} data-reveal="mascara">
            {COMPROMISSOS.map((c) => (
              <li key={c.titulo}>
                <strong>{c.titulo}</strong>
                <span>{c.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className={s.rodape}>
        <span>PRUMO, serviços e reforma. Campinas, SP.</span>
        <span>
          Marca fictícia criada para demonstração pelo ANDRADE, Estúdio digital.
        </span>
      </footer>
    </div>
  );
}

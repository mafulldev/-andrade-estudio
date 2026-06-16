"use client";

// BRASA, cozinha de fogo: one-page de 5 cenas sobre o regime compartilhado
// (useCenaDemo): hero com plate em escala 1.3 -> 1, Ken Burns e saída +20%,
// títulos por linha, plates por clip-path com parallax interno.
// Assinatura da demo: a hairline do prato acende em gradiente de brasa e a
// foto do prato flutua com o cursor; em touch, o toque abre a foto inline.

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { mostrarToast } from "@/components/Toast";
import { useLenis } from "@/components/LenisProvider";
import { useCenaDemo } from "@/components/demos/useCenaDemo";
import s from "@/app/demos/brasa/brasa.module.css";

const PRATOS = [
  { nome: "Pão de fermentação lenta na chapa", desc: "Manteiga tostada no fogo e flor de sal da casa.", preco: "R$ 28" },
  { nome: "Tartar de carne com gema curada", desc: "Brioche tostado na brasa e mostarda de malte.", preco: "R$ 56" },
  { nome: "Couve-flor inteira assada", desc: "Tahine de gergelim queimado e pimenta defumada.", preco: "R$ 44" },
  { nome: "Polvo na grelha", desc: "Batata cozida na cinza e páprica feita em casa.", preco: "R$ 89" },
  { nome: "Costela de doze horas", desc: "Purê de raízes e jus reduzido no próprio fogo.", preco: "R$ 98" },
  { nome: "Pescado do dia no fogo", desc: "Beurre blanc de limão-cravo e ervas da horta.", preco: "R$ 92" },
  { nome: "Abacaxi tostado", desc: "Sorvete de queijo fresco e melado de cana.", preco: "R$ 32" },
  { nome: "Petit gâteau de chocolate intenso", desc: "Setenta por cento, flor de sal e creme de leite cru.", preco: "R$ 36" },
];

const HORARIOS_RESERVA = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

export default function BrasaPagina() {
  const raizRef = useRef<HTMLDivElement>(null);
  const flutuanteRef = useRef<HTMLDivElement>(null);
  const [pratoAtivo, setPratoAtivo] = useState<number | null>(null);
  const [pratoTocado, setPratoTocado] = useState<number | null>(null);
  const [toque, setToque] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ data: "", horario: "19:30", pessoas: "2", nome: "", whatsapp: "" });
  const { irPara } = useLenis();

  useCenaDemo(raizRef);

  useEffect(() => {
    setToque(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // assinatura: foto flutuante seguindo o cursor (desktop)
  useEffect(() => {
    const el = flutuanteRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "expo.out" });
    const mover = (e: PointerEvent) => {
      xTo(e.clientX + 30);
      yTo(e.clientY - 100);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
  }, []);

  useEffect(() => {
    const el = flutuanteRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: pratoAtivo === null ? 0 : 1,
      scale: pratoAtivo === null ? 0.95 : 1,
      duration: 0.4,
      ease: "expo.out",
    });
  }, [pratoAtivo]);

  const reservar = (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (!form.data) {
      mostrarToast("Escolha uma data para a reserva.");
      return;
    }
    if (form.nome.trim().length < 2) {
      mostrarToast("Diga seu nome para a reserva.");
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
      setForm({ data: "", horario: "19:30", pessoas: "2", nome: "", whatsapp: "" });
      mostrarToast("Reserva solicitada. Confirmamos pelo WhatsApp em instantes.");
    }, 800);
  };

  return (
    <div className={s.pagina} ref={raizRef}>
      {/* 1. HERO: o fogo recebe */}
      <section className={s.hero} data-hero>
        <div data-hero-conjunto style={{ position: "absolute", inset: 0, display: "grid", alignContent: "end" }}>
          <div className={s.heroFundo} data-hero-plate data-kenburns>
            <Image
              src="https://picsum.photos/seed/brasa-1/1920/1280"
              alt="Prato principal servido à luz do fogo"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className={s.heroMiolo} style={{ padding: "0 clamp(20px, 5vw, 72px) clamp(60px, 10vh, 110px)" }}>
            <span className={s.rotulo} data-hero-item>
              Cozinha de fogo · desde a primeira fornada
            </span>
            <h1 className={`${s.titulo} ${s.heroTitulo}`} data-hero-linhas>
              <span className="linha">
                <span data-linha>O fogo conduz</span>
              </span>
              <span className="linha">
                <span data-linha>
                  <em>a casa</em>.
                </span>
              </span>
            </h1>
            <p className={s.heroSub} data-hero-item>
              Menu degustação em oito tempos, assado em lenha de macieira. Uma
              mesa por noite, um ritmo por estação.
            </p>
            <button
              type="button"
              className={s.botaoBrasa}
              data-hero-item
              onClick={() => irPara("#reservas")}
            >
              Reservar
            </button>
          </div>
        </div>
        <div className={s.heroTopo}>
          <span className={s.wordmark}>BRASA</span>
          <span className={s.rotulo}>Campinas, SP</span>
        </div>
      </section>

      {/* 2. MENU DEGUSTAÇÃO */}
      <section className={s.secao} id="menu">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            O menu desta estação
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>Oito tempos, um fogo.</span>
            </span>
          </h2>
        </div>
        <div onPointerLeave={() => setPratoAtivo(null)} data-reveal="mascara">
          {PRATOS.map((p, i) => (
            <button
              key={p.nome}
              type="button"
              className={s.prato}
              data-aceso={pratoTocado === i || undefined}
              onPointerEnter={() => !toque && setPratoAtivo(i)}
              onClick={() => toque && setPratoTocado(pratoTocado === i ? null : i)}
            >
              <span className={s.pratoNome}>{p.nome}</span>
              <span className={s.pratoPreco}>{p.preco}</span>
              <span className={s.pratoDesc}>{p.desc}</span>
              {toque && pratoTocado === i && (
                <span
                  className={`${s.foto} ${s.pratoFotoTouch}`}
                  style={{ aspectRatio: "4 / 3", display: "block" }}
                >
                  <Image
                    src={`https://picsum.photos/seed/brasa-${i + 1}/800/600`}
                    alt={`Foto do prato ${p.nome}`}
                    fill
                    sizes="420px"
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* foto flutuante da assinatura (desktop) */}
      <div className={s.fotoFlutuante} ref={flutuanteRef} aria-hidden="true">
        {PRATOS.map((p, i) => (
          <span
            key={p.nome}
            className={`${s.foto} ${i === pratoAtivo ? s.fotoAtiva : ""}`}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={`https://picsum.photos/seed/brasa-${i + 1}/600/450`}
              alt=""
              fill
              sizes="300px"
            />
          </span>
        ))}
      </div>

      {/* 3. A CASA E O FOGO */}
      <section className={s.secao} id="casa">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            A casa e o fogo
          </span>
        </div>
        <div className={s.casaGrid}>
          <div className={s.casaTexto}>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Antes do prato, a lenha.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              A cozinha abre quatro horas antes do primeiro cliente. O forno de
              barro chega à temperatura aos poucos, a costela entra ao meio-dia
              e o pão fermenta desde a véspera.
            </p>
            <p data-reveal="mascara">
              Não há atalho no fogo: a casa serve um único menu por noite,
              escrito pela estação e pelo que o produtor trouxe de manhã.
            </p>
            <p className={s.casaCitacao} data-reveal="mascara">
              Cozinhamos com lenha de macieira e com tempo.
            </p>
          </div>
          <div
            className={`${s.foto} ${s.casaFotoA}`}
            data-reveal="plate"
            data-parallax
          >
            <Image
              src="https://picsum.photos/seed/brasa-3/1200/900"
              alt="O forno de barro aceso na cozinha"
              fill
              sizes="(max-width: 860px) 100vw, 560px"
            />
          </div>
          <div
            className={`${s.foto} ${s.casaFotoB}`}
            data-reveal="plate"
            data-parallax
          >
            <Image
              src="https://picsum.photos/seed/brasa-6/1400/788"
              alt="O salão da casa à noite"
              fill
              sizes="(max-width: 860px) 100vw, 620px"
            />
          </div>
        </div>
      </section>

      {/* 4. RESERVAS */}
      <section className={s.secao} id="reservas">
        <div className={s.reservas}>
          <div className={s.reservasInfo}>
            <span className={s.rotulo} data-reveal="mascara">
              Reservas
            </span>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Uma mesa ao lado do fogo.</span>
              </span>
            </h2>
            <p style={{ color: "var(--mudo)" }} data-reveal="mascara">
              As reservas abrem com trinta dias de antecedência. Grupos acima de
              oito pessoas, direto pelo WhatsApp da casa.
            </p>
          </div>
          <form className={s.reservasForm} onSubmit={reservar} data-reveal="mascara">
            <label className={s.campoBrasa}>
              <span>Data</span>
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })}
              />
            </label>
            <label className={s.campoBrasa}>
              <span>Horário</span>
              <select
                value={form.horario}
                onChange={(e) => setForm({ ...form, horario: e.target.value })}
              >
                {HORARIOS_RESERVA.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </label>
            <label className={s.campoBrasa}>
              <span>Pessoas</span>
              <select
                value={form.pessoas}
                onChange={(e) => setForm({ ...form, pessoas: e.target.value })}
              >
                {["2", "3", "4", "5", "6", "7", "8"].map((n) => (
                  <option key={n} value={n}>{n} pessoas</option>
                ))}
              </select>
            </label>
            <label className={s.campoBrasa}>
              <span>Nome</span>
              <input
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>
            <label className={`${s.campoBrasa} ${s.campoLargo}`}>
              <span>WhatsApp</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </label>
            <div className={s.campoLargo}>
              <button type="submit" className={s.botaoBrasa} disabled={enviando}>
                {enviando ? "Enviando" : "Solicitar reserva"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. ENDEREÇO, HORÁRIOS E MAPA */}
      <section className={s.secao} id="onde">
        <div className={s.onde}>
          <div className={s.ondeInfo}>
            <span className={s.rotulo} data-reveal="mascara">
              Onde e quando
            </span>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Rua do Carvalho, 217.</span>
              </span>
              <span className="linha">
                <span data-linha>Centro, Campinas.</span>
              </span>
            </h2>
            <ul className={s.horarios} data-reveal="mascara">
              <li><span>Terça a quinta</span><span>19h às 23h</span></li>
              <li><span>Sexta e sábado</span><span>19h à meia-noite</span></li>
              <li><span>Domingo</span><span>12h às 16h, fogo de chão</span></li>
              <li><span>Segunda</span><span>Fechado, dia de lenha</span></li>
            </ul>
            <p style={{ color: "var(--mudo)", fontSize: 14 }} data-reveal="mascara">
              Estacionamento conveniado na esquina. A casa não tem lista de
              espera: sem reserva, o balcão recebe por ordem de chegada.
            </p>
          </div>
          <div
            className={s.mapa}
            data-reveal="mascara"
            aria-label="Mapa estilizado da região da casa"
          >
            <svg viewBox="0 0 560 420" role="img" aria-hidden="true">
              <rect width="560" height="420" fill="oklch(0.17 0.012 40)" />
              <g stroke="oklch(0.94 0.015 85 / 0.22)" strokeWidth="1">
                <path d="M0 90 H560" />
                <path d="M0 210 H560" />
                <path d="M0 330 H560" />
                <path d="M120 0 V420" />
                <path d="M280 0 V420" />
                <path d="M430 0 V420" />
                <path d="M0 40 L560 150" />
              </g>
              <g stroke="oklch(0.94 0.015 85 / 0.4)" strokeWidth="2">
                <path d="M120 210 H430" />
              </g>
              <circle cx="280" cy="210" r="34" fill="none" stroke="oklch(0.62 0.19 35)" strokeWidth="1" />
              <circle cx="280" cy="210" r="6" fill="oklch(0.62 0.19 35)" />
              <text x="280" y="178" textAnchor="middle" fill="oklch(0.94 0.015 85 / 0.75)" fontSize="11" letterSpacing="2" fontFamily="var(--sans)">RUA DO CARVALHO 217</text>
            </svg>
          </div>
        </div>
      </section>

      <footer className={s.rodape}>
        <span>BRASA, cozinha de fogo. Campinas, SP.</span>
        <span>
          Marca fictícia criada para demonstração pelo ANDRADE, Estúdio digital.
        </span>
      </footer>
    </div>
  );
}

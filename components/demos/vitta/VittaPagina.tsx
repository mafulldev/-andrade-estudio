"use client";

// VITTA, clínica integrada: one-page de 5 cenas sobre o regime compartilhado
// (useCenaDemo): hero com plate em escala, Ken Burns e saída +20%, títulos
// por linha, plates por clip-path com parallax interno.
// Assinatura da demo: a linha de pulso em SVG desenhando por
// stroke-dashoffset, no hero e na chamada do agendamento.

import Image from "next/image";
import { useRef, useState, type FormEvent, type SVGProps } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { mostrarToast } from "@/components/Toast";
import { useLenis } from "@/components/LenisProvider";
import { useCenaDemo } from "@/components/demos/useCenaDemo";
import s from "@/app/demos/vitta/vitta.module.css";

function Icone({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

const ESPECIALIDADES = [
  {
    nome: "Clínica geral",
    desc: "Acompanhamento contínuo, check-up anual e porta de entrada do cuidado.",
    icone: (
      <Icone>
        <circle cx="9" cy="5.5" r="2" />
        <path d="M9 7.5v5a4 4 0 0 0 8 0V9" />
        <circle cx="17" cy="7" r="2" />
      </Icone>
    ),
  },
  {
    nome: "Cardiologia",
    desc: "Prevenção, ergometria e acompanhamento de pressão e ritmo.",
    icone: (
      <Icone>
        <path d="M12 20.5C6.5 16.5 3.5 13 3.5 9.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8.5 1.8c0 3.6-3 7.1-8.5 11.1Z" />
        <path d="M7 12h3l1.2-2.4 1.6 4 1.2-1.6H17" />
      </Icone>
    ),
  },
  {
    nome: "Dermatologia",
    desc: "Pele, cabelo e unhas, do diagnóstico ao tratamento contínuo.",
    icone: (
      <Icone>
        <path d="M12 3.5c3 4.2 6 7.2 6 10.6a6 6 0 0 1-12 0c0-3.4 3-6.4 6-10.6Z" />
      </Icone>
    ),
  },
  {
    nome: "Pediatria",
    desc: "Consultas de rotina, vacinação orientada e puericultura.",
    icone: (
      <Icone>
        <circle cx="12" cy="9" r="4.5" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M9.5 4.5C9.5 3 11 2.5 12 3.5c1-1 2.5-.5 2.5 1" />
      </Icone>
    ),
  },
  {
    nome: "Nutrição",
    desc: "Plano alimentar realista, sem terrorismo de prato.",
    icone: (
      <Icone>
        <path d="M12 7c-4 0-6.5 2.6-6.5 6a6.5 6.5 0 0 0 13 0c0-3.4-2.5-6-6.5-6Z" />
        <path d="M12 7c0-2 1.2-3.5 3-4" />
      </Icone>
    ),
  },
  {
    nome: "Fisioterapia",
    desc: "Reabilitação, dor crônica e retorno seguro ao movimento.",
    icone: (
      <Icone>
        <circle cx="17" cy="5" r="1.8" />
        <path d="M14.5 8.5 10 11l2.5 3-1.5 5" />
        <path d="m10 11-4 1.5" />
        <path d="m12.5 14 4.5 1 1.5 4" />
      </Icone>
    ),
  },
];

const CORPO = [
  { nome: "Dra. Helena Prado", area: "Clínica geral", crm: "CRM/SP 000000", foto: "/demos/vitta/dra-helena.avif" },
  { nome: "Dr. Caio Monteiro", area: "Cardiologia", crm: "CRM/SP 000000", foto: "/demos/vitta/dr-caio.avif" },
  { nome: "Dra. Júlia Tavares", area: "Dermatologia", crm: "CRM/SP 000000", foto: "/demos/vitta/dra-julia.avif" },
];

function LinhaPulso({ id }: { id: string }) {
  return (
    <span className={s.pulso} aria-hidden="true">
      <svg viewBox="0 0 600 80">
        <path
          data-pulso={id}
          d="M0 40 H170 L195 40 L210 14 L228 66 L244 40 H330 L348 40 L360 24 L372 52 L382 40 H600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function VittaPagina() {
  const raizRef = useRef<HTMLDivElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    especialidade: "Clínica geral",
    periodo: "Manhã",
  });
  const { irPara } = useLenis();

  useCenaDemo(raizRef);

  // assinatura: pulso desenhando por stroke-dashoffset
  useGSAP(
    () => {
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<SVGPathElement>("[data-pulso]").forEach((caminho) => {
        const comprimento = caminho.getTotalLength();
        caminho.style.strokeDasharray = `${comprimento}`;
        if (reduzido) {
          caminho.style.strokeDashoffset = "0";
          return;
        }
        caminho.style.strokeDashoffset = `${comprimento}`;
        gsap.to(caminho, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: caminho, start: "top 90%", once: true },
        });
      });
    },
    { scope: raizRef },
  );

  const agendar = (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (form.nome.trim().length < 2) {
      mostrarToast("Diga seu nome para o agendamento.");
      return;
    }
    if (form.telefone.replace(/\D/g, "").length < 10) {
      mostrarToast("Confira o telefone, com DDD.");
      return;
    }
    setEnviando(true);
    // demonstração: simula o envio, sem gravar no banco
    window.setTimeout(() => {
      setEnviando(false);
      setForm({ nome: "", telefone: "", especialidade: "Clínica geral", periodo: "Manhã" });
      mostrarToast("Pedido recebido. A recepção confirma o horário por telefone.");
    }, 800);
  };

  return (
    <div className={s.pagina} ref={raizRef}>
      {/* 1. HERO: o cuidado recebe */}
      <section className={s.hero} data-hero data-hero-conjunto>
        <div className={s.heroTopo}>
          <span className={s.wordmark}>V I T T A</span>
          <span className={s.rotulo}>Clínica integrada</span>
        </div>
        <div className={s.heroMiolo}>
          <span className={s.rotulo} data-hero-item>
            Seis especialidades, um prontuário
          </span>
          <h1 className={`${s.titulo} ${s.heroTitulo}`} data-hero-linhas>
            <span className="linha">
              <span data-linha>Cuidar é um</span>
            </span>
            <span className="linha">
              <span data-linha>
                <em>método</em>.
              </span>
            </span>
          </h1>
          <p className={s.heroSub} data-hero-item>
            Consultas com hora de verdade, prontuário compartilhado entre as
            especialidades e retorno incluído em todo atendimento.
          </p>
          <span data-hero-item style={{ width: "100%" }}>
            <LinhaPulso id="hero" />
          </span>
          <button
            type="button"
            className={s.botaoVitta}
            data-hero-item
            onClick={() => irPara("#agendar")}
          >
            Agendar consulta
          </button>
        </div>
        <div className={`${s.foto} ${s.heroFoto}`} data-hero-plate data-kenburns>
          <Image
            src="/demos/vitta/recepcao.avif"
            alt="Recepção clara e tranquila da clínica"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 45vw"
          />
        </div>
      </section>

      {/* 2. ESPECIALIDADES */}
      <section className={s.secao} id="especialidades">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Especialidades
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>O cuidado inteiro, no mesmo endereço.</span>
            </span>
          </h2>
        </div>
        <div className={s.especialidades}>
          {ESPECIALIDADES.map((e) => (
            <div className={s.especialidade} key={e.nome} data-reveal="mascara">
              {e.icone}
              <span className={s.espNome}>{e.nome}</span>
              <span className={s.espDesc}>{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORPO CLÍNICO */}
      <section className={s.secao} id="equipe">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Corpo clínico
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>Quem cuida de quem chega.</span>
            </span>
          </h2>
        </div>
        <div className={s.corpo}>
          {CORPO.map((p) => (
            <div className={s.perfil} key={p.nome}>
              <div className={`${s.foto} ${s.perfilFoto}`} data-reveal="plate">
                <Image
                  src={p.foto}
                  alt={`Retrato de ${p.nome}`}
                  fill
                  sizes="(max-width: 860px) 100vw, 360px"
                />
              </div>
              <span className={s.perfilNome} data-reveal="mascara">
                {p.nome}
              </span>
              <span style={{ color: "var(--mudo)", fontSize: 15 }} data-reveal="mascara">
                {p.area}
              </span>
              <span className={s.perfilCrm} data-reveal="mascara">
                {p.crm}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AGENDAMENTO */}
      <section className={`${s.secao} ${s.agendar}`} id="agendar" style={{ maxWidth: "none" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className={s.agendarGrid}>
            <div className={s.agendarInfo}>
              <span className={s.rotulo} data-reveal="mascara">
                Agendamento
              </span>
              <h2
                className={s.titulo}
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
                data-reveal="linhas"
              >
                <span className="linha">
                  <span data-linha>Um horário que respeita o seu.</span>
                </span>
              </h2>
              <p style={{ color: "var(--mudo)", margin: 0 }} data-reveal="mascara">
                Deixe seus dados e a recepção retorna no mesmo dia útil para
                confirmar o melhor horário. Consultas também por telemedicina.
              </p>
              <LinhaPulso id="agendar" />
              <div
                className={`${s.foto} ${s.agendarFoto}`}
                data-reveal="plate"
                data-parallax
              >
                <Image
                  src="/demos/vitta/corredor.avif"
                  alt="Corredor claro da clínica"
                  fill
                  sizes="(max-width: 860px) 100vw, 520px"
                />
              </div>
            </div>
            <form className={s.agendarForm} onSubmit={agendar} data-reveal="mascara">
              <label className={s.campoVitta}>
                <span>Nome</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </label>
              <label className={s.campoVitta}>
                <span>Telefone</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </label>
              <label className={s.campoVitta}>
                <span>Especialidade</span>
                <select
                  value={form.especialidade}
                  onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                >
                  {ESPECIALIDADES.map((e) => (
                    <option key={e.nome} value={e.nome}>{e.nome}</option>
                  ))}
                </select>
              </label>
              <label className={s.campoVitta}>
                <span>Período preferido</span>
                <select
                  value={form.periodo}
                  onChange={(e) => setForm({ ...form, periodo: e.target.value })}
                >
                  {["Manhã", "Tarde", "Fim de tarde"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <div className={s.campoLargo}>
                <button type="submit" className={s.botaoVitta} disabled={enviando}>
                  {enviando ? "Enviando" : "Pedir agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 5. CONVÊNIOS E CONTATO */}
      <section className={s.secao} id="convenios">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Convênios e contato
          </span>
        </div>
        <div className={s.convenios}>
          <ul className={s.conveniosLista} data-reveal="mascara">
            <li>
              <span>Convênios empresariais</span>
              <span>Consulte o RH da sua empresa</span>
            </li>
            <li>
              <span>Planos regionais de saúde</span>
              <span>Confirme cobertura pelo telefone</span>
            </li>
            <li>
              <span>Particular com recibo</span>
              <span>Reembolso junto ao seu plano</span>
            </li>
            <li>
              <span>Telemedicina</span>
              <span>Para retornos e orientações</span>
            </li>
          </ul>
          <div className={s.contatoBloco}>
            <div
              className={`${s.foto} ${s.contatoFoto}`}
              data-reveal="plate"
              data-parallax
            >
              <Image
                src="/demos/vitta/fachada.avif"
                alt="Fachada da clínica pela manhã"
                fill
                sizes="(max-width: 860px) 100vw, 420px"
              />
            </div>
            <p data-reveal="mascara">
              <strong>Endereço.</strong> Avenida das Acácias, 940. Jardim Europa,
              Indaiatuba, SP.
            </p>
            <p data-reveal="mascara">
              <strong>Horários.</strong> Segunda a sexta, das 7h às 19h. Sábado,
              das 8h ao meio-dia.
            </p>
            <p data-reveal="mascara">
              <strong>Recepção.</strong> Atendimento por telefone e WhatsApp em
              horário comercial.
            </p>
            <span data-reveal="mascara">
              <button
                type="button"
                className={`${s.botaoVitta} ${s.botaoVittaLeve}`}
                onClick={() => irPara("#agendar")}
              >
                Agendar consulta
              </button>
            </span>
          </div>
        </div>
      </section>

      <footer className={s.rodape}>
        <span>VITTA, clínica integrada. Indaiatuba, SP.</span>
        <span>
          Marca fictícia criada para demonstração pelo ANDRADE, Estúdio digital.
        </span>
      </footer>
    </div>
  );
}

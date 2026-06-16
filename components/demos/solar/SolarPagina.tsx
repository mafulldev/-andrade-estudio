"use client";

// SOLAR, imobiliária: one-page de 5 cenas sobre o regime compartilhado
// (useCenaDemo): hero com imóvel destaque em plate e parallax interno,
// títulos por linha, plates por clip-path.
// Assinatura da demo: microgaleria de 3 imagens por clip-path em dots
// hairline, com contra-parallax próprio nos quadros.

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { mostrarToast } from "@/components/Toast";
import { useLenis } from "@/components/LenisProvider";
import { useCenaDemo } from "@/components/demos/useCenaDemo";
import s from "@/app/demos/solar/solar.module.css";

const IMOVEIS = [
  {
    nome: "Casa do Pátio",
    bairro: "Jardim das Paineiras",
    desc: "Térrea de pátio interno, pé-direito duplo na sala e cozinha aberta para o jardim. Sol da tarde na varanda.",
    ficha: [
      ["Área construída", "240 m²"],
      ["Quartos", "4, sendo 2 suítes"],
      ["Vagas", "3 cobertas"],
      ["Preço", "R$ 1.890.000"],
    ],
    fotos: ["/demos/solar/casa-patio-patio.avif", "/demos/solar/casa-patio-interior.avif", "/demos/solar/varanda.avif"],
  },
  {
    nome: "Apartamento Horizonte",
    bairro: "Cambuí",
    desc: "Andar alto com vista desimpedida, varanda gourmet envidraçada e planta reformada por arquiteto.",
    ficha: [
      ["Área privativa", "132 m²"],
      ["Quartos", "3, sendo 1 suíte"],
      ["Vagas", "2 livres"],
      ["Preço", "R$ 1.150.000"],
    ],
    fotos: ["/demos/solar/apartamento-interior.avif", "/demos/solar/vista-horizonte.avif", "/demos/solar/varanda-gourmet.avif"],
  },
  {
    nome: "Refúgio da Serra",
    bairro: "Joaquim Egídio",
    desc: "Casa de campo a vinte minutos do centro, pomar formado, piscina de borda natural e escritório com vista.",
    ficha: [
      ["Área construída", "280 m²"],
      ["Quartos", "4, sendo 3 suítes"],
      ["Vagas", "4, sendo 2 cobertas"],
      ["Preço", "R$ 2.400.000"],
    ],
    fotos: ["/demos/solar/refugio-serra.avif", "/demos/solar/varanda.avif", "/demos/solar/vista-horizonte.avif"],
  },
];

function Microgaleria({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [ativa, setAtiva] = useState(0);
  const [anterior, setAnterior] = useState(0);

  const trocar = (i: number) => {
    if (i === ativa) return;
    setAnterior(ativa);
    setAtiva(i);
  };

  return (
    <div className={s.galeria}>
      <div className={s.galeriaQuadro} data-contra-solar data-reveal="plate">
        {fotos.map((foto, i) => (
          <div
            key={`${foto}-${i}`}
            className={`${s.galeriaImg} ${
              i === ativa ? s.galeriaImgAtiva : i === anterior ? s.galeriaImgAnterior : ""
            }`}
          >
            <Image
              src={foto}
              alt={i === ativa ? alt : ""}
              fill
              sizes="(max-width: 860px) 100vw, 640px"
            />
          </div>
        ))}
      </div>
      <div className={s.galeriaDots} role="group" aria-label={`Fotos de ${alt}`}>
        {fotos.map((foto, i) => (
          <button
            key={`${foto}-dot-${i}`}
            type="button"
            aria-current={i === ativa}
            aria-label={`Foto ${i + 1} de ${fotos.length}`}
            onClick={() => trocar(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SolarPagina() {
  const raizRef = useRef<HTMLDivElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    imovel: IMOVEIS[0].nome,
    periodo: "Fim de tarde",
  });
  const { irPara } = useLenis();

  useCenaDemo(raizRef);

  // assinatura: contra-parallax próprio dos quadros da microgaleria
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const f = window.matchMedia("(max-width: 860px)").matches ? 0.4 : 1;
      gsap.utils.toArray<HTMLElement>("[data-contra-solar]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 * f },
          { yPercent: 4 * f, ease: "none", scrollTrigger: { trigger: el, scrub: 1 } },
        );
      });
    },
    { scope: raizRef },
  );

  const agendarVisita = (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (form.nome.trim().length < 2) {
      mostrarToast("Diga seu nome para a visita.");
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
      setForm({ nome: "", whatsapp: "", imovel: IMOVEIS[0].nome, periodo: "Fim de tarde" });
      mostrarToast("Visita solicitada. O corretor confirma o horário pelo WhatsApp.");
    }, 800);
  };

  return (
    <div className={s.pagina} ref={raizRef}>
      {/* 1. HERO com imóvel destaque em plate e parallax */}
      <section className={s.hero} data-hero data-hero-conjunto>
        <div className={s.heroTopo}>
          <span className={s.wordmark}>SOLAR</span>
          <span className={s.rotulo}>Imobiliária · Campinas, SP</span>
        </div>
        <div className={s.heroMiolo}>
          <span className={s.rotulo} data-hero-item>
            Coleção curta, visita acompanhada
          </span>
          <h1 className={`${s.titulo} ${s.heroTitulo}`} data-hero-linhas>
            <span className="linha">
              <span data-linha>Casas com a luz</span>
            </span>
            <span className="linha">
              <span data-linha>
                do <em>fim de tarde</em>.
              </span>
            </span>
          </h1>
          <p className={s.heroSub} data-hero-item>
            Três imóveis por vez, escolhidos a dedo. Sem portal infinito, sem
            anúncio repetido: curadoria, ficha honesta e visita com hora.
          </p>
          <button
            type="button"
            className={s.botaoSolar}
            data-hero-item
            onClick={() => irPara("#visita")}
          >
            Agendar visita
          </button>
        </div>
        <div
          className={`${s.foto} ${s.heroDestaque}`}
          data-hero-plate
          data-parallax
        >
          <Image
            src="/demos/solar/casa-patio-fachada.avif"
            alt="Fachada do imóvel em destaque ao entardecer"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 50vw"
          />
          <div className={s.heroFicha}>
            <span className={s.heroFichaNome}>Casa do Pátio</span>
            <span className={s.heroFichaMeta}>Jardim das Paineiras · 240 m²</span>
          </div>
        </div>
      </section>

      {/* 2. COLEÇÃO */}
      <section className={s.secao} id="colecao">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            A coleção desta estação
          </span>
          <h2
            className={s.titulo}
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
            data-reveal="linhas"
          >
            <span className="linha">
              <span data-linha>Três imóveis, três fichas honestas.</span>
            </span>
          </h2>
        </div>
        {IMOVEIS.map((im) => (
          <article className={s.imovel} key={im.nome}>
            <div className={s.imovelGaleria}>
              <Microgaleria fotos={im.fotos} alt={`${im.nome}, ${im.bairro}`} />
            </div>
            <div className={s.imovelTexto}>
              <span className={s.rotulo} data-reveal="mascara">
                {im.bairro}
              </span>
              <h3 className={s.imovelNome} data-reveal="mascara">
                {im.nome}
              </h3>
              <p className={s.imovelDesc} data-reveal="mascara">
                {im.desc}
              </p>
              <ul className={s.ficha} data-reveal="mascara">
                {im.ficha.map(([rotulo, valor]) => (
                  <li key={rotulo}>
                    <span>{rotulo}</span>
                    <span>{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* 3. A IMOBILIÁRIA */}
      <section className={s.secao} id="imobiliaria">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            A imobiliária
          </span>
        </div>
        <div className={s.sobre}>
          <div className={s.sobreTexto}>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Vendemos poucas casas</span>
              </span>
              <span className="linha">
                <span data-linha>de propósito.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              A SOLAR trabalha com uma coleção curta: cada imóvel passa por
              vistoria própria, fotografia na melhor luz do dia e ficha sem
              adjetivo vazio, com o que importa por escrito.
            </p>
            <p data-reveal="mascara">
              A visita é sempre acompanhada pelo corretor responsável, que
              conhece a casa, a rua e a vizinhança. Se o imóvel não serve para
              você, dizemos antes de marcar.
            </p>
          </div>
          <div className={`${s.foto} ${s.sobreFoto}`} data-reveal="plate" data-parallax>
            <Image
              src="/demos/solar/apartamento-interior.avif"
              alt="O escritório da imobiliária ao entardecer"
              fill
              sizes="(max-width: 860px) 100vw, 420px"
            />
          </div>
        </div>
      </section>

      {/* 4. AGENDAR VISITA */}
      <section className={`${s.secao} ${s.visita}`} id="visita" style={{ maxWidth: "none" }}>
        <div className={s.visitaGrid}>
          <div className={s.visitaInfo}>
            <span className={s.rotulo} data-reveal="mascara">
              Agendar visita
            </span>
            <h2
              className={s.titulo}
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              data-reveal="linhas"
            >
              <span className="linha">
                <span data-linha>Veja a casa na luz certa.</span>
              </span>
            </h2>
            <p data-reveal="mascara">
              Agendamos de preferência no fim de tarde, quando a luz mostra a
              casa como ela é. Visitas duram o tempo que você precisar.
            </p>
          </div>
          <form className={s.visitaForm} onSubmit={agendarVisita} data-reveal="mascara">
            <label className={s.campoSolar}>
              <span>Nome</span>
              <input
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>
            <label className={s.campoSolar}>
              <span>WhatsApp</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </label>
            <label className={s.campoSolar}>
              <span>Imóvel</span>
              <select
                value={form.imovel}
                onChange={(e) => setForm({ ...form, imovel: e.target.value })}
              >
                {IMOVEIS.map((im) => (
                  <option key={im.nome} value={im.nome}>{im.nome}</option>
                ))}
              </select>
            </label>
            <label className={s.campoSolar}>
              <span>Período</span>
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
              <button
                type="submit"
                className={`${s.botaoSolar} ${s.botaoSolarClaro}`}
                disabled={enviando}
              >
                {enviando ? "Enviando" : "Solicitar visita"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. REGIÕES E CONTATO */}
      <section className={s.secao} id="regioes">
        <div className={s.cabecaSecao}>
          <span className={s.rotulo} data-reveal="mascara">
            Regiões e contato
          </span>
        </div>
        <div className={s.regioes}>
          <ul className={s.regioesLista} data-reveal="mascara">
            <li>
              <span>Cambuí e Centro</span>
              <span>Apartamentos de planta generosa</span>
            </li>
            <li>
              <span>Jardim das Paineiras e Taquaral</span>
              <span>Casas térreas e sobrados com quintal</span>
            </li>
            <li>
              <span>Joaquim Egídio e Sousas</span>
              <span>Campo a vinte minutos do centro</span>
            </li>
            <li>
              <span>Valinhos e Vinhedo</span>
              <span>Condomínios com mata preservada</span>
            </li>
          </ul>
          <div className={s.contatoBloco}>
            <p data-reveal="mascara">
              <strong>Escritório.</strong> Rua Coronel Quirino, 880. Cambuí,
              Campinas, SP.
            </p>
            <p data-reveal="mascara">
              <strong>Horário.</strong> Segunda a sexta, das 9h às 18h. Sábado
              com visitas agendadas.
            </p>
            <p data-reveal="mascara">
              <strong>CRECI.</strong> Registro fictício para demonstração.
            </p>
            <span data-reveal="mascara">
              <button type="button" className={s.botaoSolar} onClick={() => irPara("#visita")}>
                Agendar visita
              </button>
            </span>
          </div>
        </div>
      </section>

      <footer className={s.rodape}>
        <span>SOLAR, imobiliária. Campinas, SP.</span>
        <span>
          Marca fictícia criada para demonstração pelo ANDRADE, Estúdio digital.
        </span>
      </footer>
    </div>
  );
}

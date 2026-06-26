"use client";

// Paleta de comandos (Ctrl K / cmd K): navegar para qualquer capítulo/rota,
// alternar tema, copiar e-mail, abrir WhatsApp. dialog + combobox/listbox
// ARIA completos, foco preso no input, setas circulam, Enter executa, Esc
// fecha e devolve o foco. Lenis pausado enquanto aberta. Presença e painel
// são do Motion (AnimatePresence + spring sem bounce); o marcador do item
// ativo é uma magic line por layoutId; o Scramble do rótulo segue no GSAP
// (texto, nó distinto). Desabilitada nas demos (identidade isolada).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { AnimatePresence, m } from "motion/react";
import { useLenis } from "@/components/LenisProvider";
import { mostrarToast } from "@/components/Toast";
import { aplicarTemaNoDocumento, gravarTemaCliente } from "@/lib/tema";
import { registrarMotion } from "@/lib/motion/registro";

registrarMotion();

const EMAIL = "ma.fulldev@gmail.com";
const WHATSAPP = "https://wa.me/5519971460099";

type Comando = {
  id: string;
  grupo: "Navegar" | "Ações";
  rotulo: string;
  atalho?: string;
  hash?: string;
  rota?: string;
  acao?: "tema" | "email" | "whatsapp";
};

const COMANDOS: Comando[] = [
  { id: "inicio", grupo: "Navegar", rotulo: "Início", hash: "#cap-abertura" },
  {
    id: "solucoes",
    grupo: "Navegar",
    rotulo: "Soluções, os dois caminhos",
    hash: "#cap-caminhos",
  },
  {
    id: "projetos",
    grupo: "Navegar",
    rotulo: "Projetos, os cinco modelos",
    hash: "#cap-modelos",
  },
  {
    id: "diagnostico",
    grupo: "Navegar",
    rotulo: "Iniciar diagnóstico",
    rota: "/diagnostico",
  },
  {
    id: "estudio",
    grupo: "Navegar",
    rotulo: "O estúdio",
    hash: "#cap-estudio",
  },
  {
    id: "bastidores",
    grupo: "Navegar",
    rotulo: "Bastidores, como este site foi feito",
    hash: "#cap-bastidores",
  },
  {
    id: "investimento",
    grupo: "Navegar",
    rotulo: "Investimento e dúvidas",
    hash: "#cap-investimento",
  },
  { id: "contato", grupo: "Navegar", rotulo: "Contato", hash: "#cap-final" },
  {
    id: "brasa",
    grupo: "Navegar",
    rotulo: "Modelo BRASA, restaurantes",
    rota: "/demos/brasa",
  },
  {
    id: "vitta",
    grupo: "Navegar",
    rotulo: "Modelo VITTA, saúde",
    rota: "/demos/vitta",
  },
  {
    id: "foro",
    grupo: "Navegar",
    rotulo: "Modelo FORO, advocacia",
    rota: "/demos/foro",
  },
  {
    id: "prumo",
    grupo: "Navegar",
    rotulo: "Modelo PRUMO, serviços",
    rota: "/demos/prumo",
  },
  {
    id: "solar",
    grupo: "Navegar",
    rotulo: "Modelo SOLAR, imobiliário",
    rota: "/demos/solar",
  },
  {
    id: "neurocode",
    grupo: "Navegar",
    rotulo: "NeuroCode AI, sistema em produção",
    hash: "#projeto-real",
  },
  {
    id: "privacidade",
    grupo: "Navegar",
    rotulo: "Política de privacidade",
    rota: "/privacidade",
  },
  {
    id: "tema",
    grupo: "Ações",
    rotulo: "Alternar tema, noite e marfim",
    acao: "tema",
  },
  {
    id: "email",
    grupo: "Ações",
    rotulo: "Copiar e-mail do estúdio",
    acao: "email",
  },
  {
    id: "whatsapp",
    grupo: "Ações",
    rotulo: "Abrir conversa no WhatsApp",
    acao: "whatsapp",
  },
];

const normalizar = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function CommandPalette() {
  const [aberta, setAberta] = useState(false);
  const [query, setQuery] = useState("");
  const [ativo, setAtivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const anteriorRef = useRef<HTMLElement | null>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();
  const { parar, seguir, irPara } = useLenis();

  const emDemo = path.startsWith("/demos");

  const filtrados = useMemo(() => {
    const q = normalizar(query.trim());
    if (!q) return COMANDOS;
    return COMANDOS.filter((c) => normalizar(c.rotulo).includes(q));
  }, [query]);

  const fechar = useCallback(() => {
    setAberta(false);
    seguir();
    anteriorRef.current?.focus();
  }, [seguir]);

  const executar = useCallback(
    (c: Comando) => {
      if (c.acao === "tema") {
        const novo =
          document.documentElement.dataset.theme === "light" ? "dark" : "light";
        aplicarTemaNoDocumento(novo);
        gravarTemaCliente(novo);
        mostrarToast(novo === "light" ? "Tema marfim." : "Tema noite.");
        fechar();
        return;
      }
      if (c.acao === "email") {
        navigator.clipboard
          .writeText(EMAIL)
          .then(() => mostrarToast("E-mail copiado."))
          .catch(() => mostrarToast(EMAIL));
        fechar();
        return;
      }
      if (c.acao === "whatsapp") {
        window.open(WHATSAPP, "_blank", "noopener,noreferrer");
        fechar();
        return;
      }
      fechar();
      if (c.hash) {
        if (path === "/") {
          window.setTimeout(() => irPara(c.hash!), 80);
        } else {
          router.push(`/${c.hash}`);
        }
        return;
      }
      if (c.rota) router.push(c.rota);
    },
    [fechar, irPara, path, router],
  );

  // atalho global: abrir e fechar pelo MESMO caminho (fechar devolve o foco)
  useEffect(() => {
    if (emDemo) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (aberta) {
          fechar();
          return;
        }
        anteriorRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        parar();
        setQuery("");
        setAtivo(0);
        setAberta(true);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberta, emDemo, fechar, parar]);

  // modal de verdade: enquanto aberta, Esc fecha em nível de documento e
  // Tab nunca escapa do diálogo (o input é o único focável do painel)
  useEffect(() => {
    if (!aberta) return;
    const aoTeclarDoc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        fechar();
      } else if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", aoTeclarDoc);
    return () => document.removeEventListener("keydown", aoTeclarDoc);
  }, [aberta, fechar]);

  // abertura: foco no input (a entrada visual é do Motion, abaixo)
  useEffect(() => {
    if (!aberta) return;
    inputRef.current?.focus();
  }, [aberta]);

  // item ativo decodifica de leve
  useEffect(() => {
    if (!aberta) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = listaRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"] .paleta-rotulo',
    );
    if (!el) return;
    gsap.to(el, {
      duration: 0.25,
      ease: "none",
      scrambleText: { text: "{original}", chars: "andrade", speed: 1.2 },
    });
  }, [ativo, aberta, query]);

  if (emDemo) return null;

  // Esc e Tab são tratados em nível de documento (efeito acima)
  const aoTeclarInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((a) => (a + 1) % Math.max(filtrados.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo(
        (a) =>
          (a - 1 + Math.max(filtrados.length, 1)) %
          Math.max(filtrados.length, 1),
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtrados[ativo];
      if (c) executar(c);
    }
  };

  const grupos: ("Navegar" | "Ações")[] = ["Navegar", "Ações"];

  return (
    <AnimatePresence>
      {aberta && (
        <div
          className="paleta"
          role="dialog"
          aria-modal="true"
          aria-label="Paleta de comandos"
        >
          <m.div
            className="paleta-veu"
            onClick={fechar}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
          <m.div
            className="paleta-painel"
            initial={{ clipPath: "inset(0 0 100% 0)", y: -8 }}
            animate={{
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              transition: { type: "spring", visualDuration: 0.6, bounce: 0 },
            }}
            exit={{
              clipPath: "inset(0 0 100% 0)",
              opacity: 0,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <div className="paleta-campo">
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls="paleta-listbox"
                aria-activedescendant={
                  filtrados[ativo]
                    ? `paleta-op-${filtrados[ativo].id}`
                    : undefined
                }
                aria-label="Buscar comando"
                placeholder="Para onde vamos?"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAtivo(0);
                }}
                onKeyDown={aoTeclarInput}
              />
              <kbd>ESC</kbd>
            </div>
            {filtrados.length === 0 && (
              <p className="paleta-vazia">
                Nada por esse nome. Tente "modelo" ou "tema".
              </p>
            )}
            <div
              className="paleta-lista"
              id="paleta-listbox"
              role="listbox"
              aria-label="Comandos"
              ref={listaRef}
              data-lenis-prevent
            >
              {grupos.map((grupo) => {
                const doGrupo = filtrados.filter((c) => c.grupo === grupo);
                if (doGrupo.length === 0) return null;
                return (
                  <div key={grupo} role="group" aria-label={grupo}>
                    <p className="label paleta-grupo" aria-hidden="true">
                      {grupo}
                    </p>
                    {doGrupo.map((c) => {
                      const idx = filtrados.indexOf(c);
                      return (
                        <m.div
                          key={c.id}
                          layout
                          transition={{
                            type: "spring",
                            visualDuration: 0.45,
                            bounce: 0,
                          }}
                          id={`paleta-op-${c.id}`}
                          className="paleta-item"
                          role="option"
                          aria-selected={idx === ativo}
                          onPointerEnter={() => setAtivo(idx)}
                          onClick={() => executar(c)}
                        >
                          {idx === ativo && (
                            <m.span
                              layoutId="paleta-marcador"
                              className="paleta-marcador"
                              transition={{
                                type: "spring",
                                visualDuration: 0.45,
                                bounce: 0,
                              }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="paleta-rotulo">{c.rotulo}</span>
                          {c.atalho && (
                            <span className="atalho">{c.atalho}</span>
                          )}
                        </m.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

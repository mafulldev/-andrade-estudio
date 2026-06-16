"use client";

// Toast do sistema: fila via CustomEvent, aria-live polite. Presença e
// empilhamento são do Motion (AnimatePresence + layout, spring sem bounce);
// a hairline âmbar de tempo restante é CSS puro em nó próprio.

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";

const TEMPO_MS = 3400;

export function mostrarToast(mensagem: string) {
  window.dispatchEvent(new CustomEvent<string>("andrade:toast", { detail: mensagem }));
}

export default function Toasts() {
  const [lista, setLista] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    let proximoId = 0;
    const ouvir = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      const id = ++proximoId;
      setLista((l) => [...l, { id, msg }]);
      window.setTimeout(() => {
        setLista((l) => l.filter((t) => t.id !== id));
      }, TEMPO_MS);
    };
    window.addEventListener("andrade:toast", ouvir);
    return () => window.removeEventListener("andrade:toast", ouvir);
  }, []);

  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {lista.map((t) => (
          <m.div
            key={t.id}
            layout
            transition={{ type: "spring", visualDuration: 0.45, bounce: 0 }}
            className="toast"
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { type: "spring", visualDuration: 0.45, bounce: 0 },
            }}
            exit={{
              opacity: 0,
              y: 8,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {t.msg}
            <span className="toast-tempo" aria-hidden="true" />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

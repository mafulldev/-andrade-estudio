// 404 do estúdio: a fachada escura com uma única janela acesa.
// Ninguém aqui, mas a luz está ligada.

import Link from "next/link";
import Figura from "@/components/Figura";
import { IcoSetaDireita } from "@/components/Icones";

export default function NaoEncontrada() {
  return (
    <main
      id="conteudo"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "var(--margem)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 280px)",
          gap: "clamp(24px, 5vw, 64px)",
          alignItems: "center",
          maxWidth: 820,
        }}
      >
        <div style={{ display: "grid", gap: 22, justifyItems: "start" }}>
          <span className="monograma" aria-hidden="true">
            A
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
            Página não encontrada.
          </h1>
          <p className="mudo">
            O endereço pode ter mudado de lugar, ou nunca existiu por aqui.
            A luz segue acesa.
          </p>
          <Link href="/" className="botao-linha" data-cursor="VER">
            <span>Voltar ao início</span>
            <IcoSetaDireita size={15} />
          </Link>
        </div>
        <Figura
          src="/fotos/quatrocentos.avif"
          alt="Fachada escura de um edifício com uma única janela acesa"
          ratio="3 / 4"
          sizes="280px"
          parallax={0}
          reveal="nenhum"
        />
      </div>
    </main>
  );
}

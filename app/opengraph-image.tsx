// OG dinâmica: monograma e wordmark sobre o preto-ouro do estúdio.
// EXCEÇÃO À REGRA OKLCH: o Satori (next/og) não suporta oklch(); os valores
// abaixo são conversões fixas dos tokens da casa (#0b0a08≈--bg-deep,
// #f2efe8≈--ink, #c9a35e/#8a6d2f≈--warm, #9b937f≈--muted).

import { ImageResponse } from "next/og";

export const alt = "ANDRADE, Estúdio digital. Arquitetura digital sob assinatura.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ImagemOg() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          backgroundColor: "#0b0a08",
          backgroundImage:
            "radial-gradient(at 70% 15%, rgba(201, 163, 94, 0.18), transparent 60%)",
          color: "#f2efe8",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 9999,
            border: "2px solid #c9a35e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
          }}
        >
          A
        </div>
        <div style={{ display: "flex", fontSize: 54, letterSpacing: 28, marginLeft: 28 }}>
          ANDRADE
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#9b937f",
            textTransform: "uppercase",
          }}
        >
          Estúdio digital
        </div>
      </div>
    ),
    size,
  );
}

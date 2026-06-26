import type { NextConfig } from "next";

// Headers de seguranca aplicados a todas as rotas.
const SEGURANCA = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

// Assets estaveis/versionados servidos de public/ (o /_next ja vem immutable
// do Next). O index.html de cada site fica de fora de proposito, para que
// atualizacoes apareсam sem cache preso.
const IMUTAVEL = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];
const PASTAS_ASSET = [
  "/trabalhos/:slug/assets/:path*",
  "/trabalhos/:slug/img/:path*",
  "/trabalhos/:slug/properties/:path*",
  "/trabalhos/:slug/hero/:path*",
  "/trabalhos/:slug/lifestyle/:path*",
  "/trabalhos/:slug/floorplans/:path*",
  "/fotos/:path*",
];

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // A galeria de conceitos reaproveita imagens reais do Unsplash via link
    // (mesmas fotos já usadas dentro de cada site de demonstração).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Em dev, o browser busca a imagem direto (máquinas com proxy ou antivírus
    // que interceptam TLS quebram o fetch do otimizador no Node). Em produção,
    // a otimização da Vercel fica ativa normalmente.
    unoptimized: process.env.NODE_ENV === "development",
  },
  async headers() {
    return [
      { source: "/(.*)", headers: SEGURANCA },
      ...PASTAS_ASSET.map((source) => ({ source, headers: IMUTAVEL })),
    ];
  },
};

export default config;

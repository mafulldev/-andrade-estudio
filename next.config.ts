import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // O site do estúdio usa só assets autorais de public/. O picsum permanece
    // EXCLUSIVAMENTE para as fotos de placeholder das 5 demos (conteúdo
    // declaradamente fictício dos nichos), até serem trocadas por fotos reais.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
    // Em dev, o browser busca a imagem direto (máquinas com proxy ou antivírus
    // que interceptam TLS quebram o fetch do otimizador no Node). Em produção,
    // a otimização da Vercel fica ativa normalmente.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default config;

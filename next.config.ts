import type { NextConfig } from "next";

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
};

export default config;

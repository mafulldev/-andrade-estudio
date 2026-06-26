// Sitemap nativo: home, diagnóstico, conceitos, privacidade e as 5 demos.
// Estimativas e admin ficam fora do índice de propósito.

import type { MetadataRoute } from "next";

const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  const rota = (
    caminho: string,
    prioridade: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${caminho}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: prioridade,
  });

  return [
    rota("/", 1),
    rota("/diagnostico", 0.9),
    rota("/conceitos", 0.7),
    rota("/demos/brasa", 0.6),
    rota("/demos/vitta", 0.6),
    rota("/demos/foro", 0.6),
    rota("/demos/prumo", 0.6),
    rota("/demos/solar", 0.6),
    rota("/privacidade", 0.3),
  ];
}

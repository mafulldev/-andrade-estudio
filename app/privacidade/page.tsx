// Política de privacidade (LGPD), específica para o que esta plataforma
// realmente coleta.
//
// REVISAR ANTES DE PUBLICAR: confira prazos de retenção, a lista de
// operadores e o e-mail de contato. Este texto descreve o comportamento
// real do código, mas a palavra final sobre a política é do titular do site.

import type { Metadata } from "next";
import Figura from "@/components/Figura";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "O que o ANDRADE, Estúdio digital coleta, por quê, por quanto tempo e como pedir a exclusão dos seus dados.",
};

const EMAIL = "matheus.andrade.c.santos@gmail.com";

const SECOES: { titulo: string; corpo: string[] }[] = [
  {
    titulo: "O que coletamos",
    corpo: [
      "No Diagnóstico: as respostas do briefing (segmento, objetivo, funcionalidades, prazo e faixa de investimento) e, somente se você preencher, nome e um contato (WhatsApp ou e-mail).",
      "Na navegação: eventos anônimos de uso do próprio site (página visitada e ações como iniciar o diagnóstico ou clicar em um botão de contato), registrados em banco próprio, sem cookies de rastreamento de terceiros e sem ferramentas externas de analytics.",
      "Nos formulários das páginas de demonstração (BRASA, VITTA, FORO, PRUMO e SOLAR) nada é coletado: os envios são simulados e nenhum dado sai do seu navegador.",
    ],
  },
  {
    titulo: "Para que usamos",
    corpo: [
      "Gerar e enviar a sua estimativa, responder ao seu pedido de contato e, com o seu consentimento, enviar um único acompanhamento por e-mail cerca de 48 horas depois.",
      "Entender o funil do próprio site (quantas pessoas iniciam e concluem o diagnóstico) com métricas agregadas.",
    ],
  },
  {
    titulo: "Base legal",
    corpo: [
      "Consentimento (art. 7º, I da LGPD) para guardar seu contato e falar com você: a caixa de autorização no Diagnóstico é o registro desse consentimento, e sem ela nenhum contato é feito.",
      "Legítimo interesse (art. 7º, IX) para os eventos de navegação agregados e anônimos do próprio site.",
    ],
  },
  {
    titulo: "Por quanto tempo",
    corpo: [
      "Leads e briefings: até 12 meses após o último contato, quando são apagados ou anonimizados.",
      "Eventos de navegação: até 12 meses.",
    ],
  },
  {
    titulo: "Com quem compartilhamos",
    corpo: [
      "Com ninguém para fins comerciais. Os dados ficam em operadores de infraestrutura contratados pelo estúdio: Supabase (banco de dados), Vercel (hospedagem), Resend (envio de e-mail), Cloudflare (verificação anti-spam Turnstile, quando ativa) e, quando ativo, Telegram (notificação interna ao estúdio). Cada um trata os dados somente para prestar o serviço.",
    ],
  },
  {
    titulo: "Seus direitos e o canal de exclusão",
    corpo: [
      "Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento, sem justificativa, escrevendo para o e-mail do estúdio. O pedido é atendido em até 7 dias úteis.",
      "A página pública da sua estimativa nunca exibe seu contato: apenas o primeiro nome, quando informado.",
    ],
  },
];

export default function PaginaPrivacidade() {
  return (
    <div style={{ minHeight: "100svh" }}>
      <Header />

      <main
        id="conteudo"
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(110px, 16vh, 150px) var(--margem) clamp(56px, 9vh, 90px)",
          display: "grid",
          gap: 28,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <span className="label">ANDRADE, Estúdio digital</span>
          <h1 style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)" }}>
            Política de privacidade.
          </h1>
          <p className="mudo">
            Em vigor desde junho de 2026. Escrita para ser lida, não para
            assustar.
          </p>
        </div>

        <Figura
          src="/fotos/privacidade-arquivo.avif"
          alt=""
          ratio="21 / 6"
          sizes="720px"
          parallax={0}
          reveal="nenhum"
          veu="vertical"
        />

        {SECOES.map((sec) => (
          <section key={sec.titulo} style={{ display: "grid", gap: 10 }}>
            <h2 style={{ fontSize: "1.25rem", borderTop: "1px solid var(--hairline)", paddingTop: 18 }}>
              {sec.titulo}
            </h2>
            {sec.corpo.map((p) => (
              <p key={p.slice(0, 40)} className="mudo" style={{ fontSize: 15.5 }}>
                {p}
              </p>
            ))}
          </section>
        ))}

        <section style={{ display: "grid", gap: 10 }}>
          <h2 style={{ fontSize: "1.25rem", borderTop: "1px solid var(--hairline)", paddingTop: 18 }}>
            Contato do controlador
          </h2>
          <p className="mudo" style={{ fontSize: 15.5 }}>
            Matheus de Andrade, ANDRADE Estúdio digital. Sumaré, SP.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="botao-linha botao-linha--compacto"
            style={{ justifySelf: "start", textTransform: "none", letterSpacing: 0 }}
          >
            <span>{EMAIL}</span>
          </a>
        </section>
      </main>
    </div>
  );
}

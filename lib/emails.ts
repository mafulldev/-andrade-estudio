// E-mails transacionais via Resend. HTML simples e sóbrio, tipografia do
// sistema, seguro em clientes claros e escuros. Sem RESEND_API_KEY, todo
// envio é pulado com aviso no log (degradação elegante).
// EXCEÇÃO À REGRA OKLCH: clientes de e-mail (Gmail, Outlook) não suportam
// oklch(); os hex abaixo são conversões fixas dos tokens claros da casa
// (#f4f2ee≈--bg marfim, #1c1a16≈--ink, #d9d4ca≈--line, #6b6557≈--muted,
// #8a6d2f≈--warm).

import { Resend } from "resend";
import { faixaPorExtenso, ROTULO_CAMINHO } from "@/lib/rotulos";
import type { Caminho } from "@/lib/motor";

// Remetente no domínio verificado do estúdio (Resend). As respostas do
// cliente vão para o ADMIN_EMAIL via replyTo, pois o domínio só envia.
const REMETENTE = "ANDRADE, Estúdio digital <contato@andradestudio.dev.br>";

function resend(): Resend | null {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    console.log("[emails] RESEND_API_KEY ausente: envio pulado");
    return null;
  }
  return new Resend(chave);
}

function moldura(conteudo: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f4f2ee;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:Georgia,'Times New Roman',serif;color:#1c1a16;">
    <p style="font-size:12px;letter-spacing:0.35em;margin:0 0 32px;color:#1c1a16;">A N D R A D E</p>
    ${conteudo}
    <hr style="border:none;border-top:1px solid #d9d4ca;margin:36px 0 16px;">
    <p style="font-size:12px;line-height:1.7;color:#6b6557;margin:0;">
      ANDRADE, Estúdio digital. Matheus de Andrade.<br>
      Sumaré, SP. Remoto para o Brasil inteiro.<br>
      <a href="https://wa.me/5519971460099" style="color:#6b6557;">WhatsApp</a> ·
      <a href="mailto:matheus.andrade.c.santos@gmail.com" style="color:#6b6557;">E-mail</a>
    </p>
  </div>
</body>
</html>`;
}

const estiloTitulo =
  "font-size:22px;font-weight:normal;line-height:1.3;margin:0 0 18px;";
const estiloTexto = "font-size:15px;line-height:1.7;margin:0 0 14px;";
const estiloDestaque =
  "font-size:18px;line-height:1.5;margin:18px 0;padding:16px 18px;border:1px solid #d9d4ca;";

export type DadosEstimativa = {
  para: string;
  nome?: string | null;
  numero: number | null;
  caminho: Caminho;
  faixaMin: number;
  faixaMax: number;
  prazoEstimado: string;
  url: string | null;
};

export async function enviarEstimativaLead(d: DadosEstimativa): Promise<void> {
  const cliente = resend();
  if (!cliente) return;

  const titulo = d.numero
    ? `Sua estimativa ANDRADE Nº ${d.numero}`
    : "Sua estimativa ANDRADE";
  const saudacao = d.nome ? `Olá, ${d.nome.split(" ")[0]}.` : "Olá.";

  const html = moldura(`
    <h1 style="${estiloTitulo}">${titulo}</h1>
    <p style="${estiloTexto}">${saudacao} Obrigado por usar o Diagnóstico do estúdio. Este é o resumo do que foi recomendado para o seu projeto.</p>
    <div style="${estiloDestaque}">
      Caminho: <strong>${ROTULO_CAMINHO[d.caminho]}</strong><br>
      Investimento estimado: <strong>${faixaPorExtenso(d.faixaMin, d.faixaMax)}</strong><br>
      Prazo estimado: <strong>${d.prazoEstimado}</strong>
    </div>
    <p style="${estiloTexto}">Estimativa preliminar. O valor final é definido após análise do briefing, sem compromisso.</p>
    ${
      d.url
        ? `<p style="${estiloTexto}">Sua estimativa tem um endereço permanente: <a href="${d.url}" style="color:#8a6d2f;">${d.url}</a></p>`
        : ""
    }
    <p style="${estiloTexto}">Quando quiser avançar, basta responder este e-mail ou chamar no WhatsApp.</p>
  `);

  const { error } = await cliente.emails.send({
    from: REMETENTE,
    replyTo: process.env.ADMIN_EMAIL,
    to: d.para,
    subject: titulo,
    html,
  });
  if (error) console.log("[emails] falha na estimativa:", error.message);
}

export type DadosFollowUp = {
  para: string;
  nome?: string | null;
  numero: number | null;
  url: string | null;
};

// Follow-up único de 48h: curto e educado, sem pressão. Só sai para leads
// com consentimento, e o cron carimba followup_enviado_em para nunca repetir.
export async function enviarFollowUpLead(d: DadosFollowUp): Promise<boolean> {
  const cliente = resend();
  if (!cliente) return false;

  const titulo = d.numero
    ? `Sobre a sua estimativa ANDRADE Nº ${d.numero}`
    : "Sobre a sua estimativa ANDRADE";
  const saudacao = d.nome ? `Olá, ${d.nome.split(" ")[0]}.` : "Olá.";

  const html = moldura(`
    <h1 style="${estiloTitulo}">${titulo}</h1>
    <p style="${estiloTexto}">${saudacao} Há dois dias você recebeu a estimativa do Diagnóstico do estúdio. Passando apenas para perguntar se ficou alguma dúvida sobre caminho, valores ou prazo.</p>
    ${
      d.url
        ? `<p style="${estiloTexto}">A estimativa continua disponível em: <a href="${d.url}" style="color:#8a6d2f;">${d.url}</a></p>`
        : ""
    }
    <p style="${estiloTexto}">Se quiser conversar, é só responder este e-mail ou chamar no WhatsApp. Sem compromisso.</p>
  `);

  const { error } = await cliente.emails.send({
    from: REMETENTE,
    replyTo: process.env.ADMIN_EMAIL,
    to: d.para,
    subject: titulo,
    html,
  });
  if (error) {
    console.log("[emails] falha no follow-up:", error.message);
    return false;
  }
  return true;
}

export type DadosDigest = {
  inicio: string;
  fim: string;
  totais: { leads: number; identificados: number };
  porTemperatura: Record<string, number>;
  porSegmento: [string, number][];
  funil: { iniciaram: number; concluiram: number; whatsapp: number };
  destaques: { nome: string; faixa: string; temperatura: string }[];
};

// Digest de segunda-feira para o ADMIN_EMAIL: a semana em uma tela.
export async function enviarDigestSemanal(d: DadosDigest): Promise<void> {
  const cliente = resend();
  const destino = process.env.ADMIN_EMAIL;
  if (!cliente || !destino) {
    if (!destino) console.log("[emails] ADMIN_EMAIL ausente: digest pulado");
    return;
  }

  const linhas = (pares: [string, string | number][]) =>
    pares
      .map(
        ([r, v]) =>
          `<tr><td style="padding:6px 0;color:#6b6557;font-size:13px;">${r}</td><td style="padding:6px 0;text-align:right;font-size:14px;"><strong>${v}</strong></td></tr>`,
      )
      .join("");

  const html = moldura(`
    <h1 style="${estiloTitulo}">Digest da semana</h1>
    <p style="${estiloTexto}">Período: ${d.inicio} a ${d.fim}.</p>
    <div style="${estiloDestaque}">
      <table style="width:100%;border-collapse:collapse;">
        ${linhas([
          ["Leads na semana", d.totais.leads],
          ["Identificados", d.totais.identificados],
          ["Quentes", d.porTemperatura.quente ?? 0],
          ["Mornos", d.porTemperatura.morno ?? 0],
          ["Frios", d.porTemperatura.frio ?? 0],
        ])}
      </table>
    </div>
    <p style="${estiloTexto}"><strong>Funil:</strong> ${d.funil.iniciaram} iniciaram o diagnóstico, ${d.funil.concluiram} concluíram, ${d.funil.whatsapp} clicaram no WhatsApp.</p>
    ${
      d.porSegmento.length
        ? `<p style="${estiloTexto}"><strong>Por nicho:</strong> ${d.porSegmento
            .map(([seg, n]) => `${seg} (${n})`)
            .join(", ")}.</p>`
        : ""
    }
    ${
      d.destaques.length
        ? `<p style="${estiloTexto}"><strong>Destaques:</strong></p>
           <table style="width:100%;border-collapse:collapse;">
           ${d.destaques
             .map(
               (l) =>
                 `<tr><td style="padding:5px 0;font-size:14px;">${l.nome}</td><td style="padding:5px 0;font-size:13px;color:#6b6557;">${l.faixa}</td><td style="padding:5px 0;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#8a6d2f;">${l.temperatura}</td></tr>`,
             )
             .join("")}
           </table>`
        : `<p style="${estiloTexto}">Semana sem leads novos.</p>`
    }
  `);

  const { error } = await cliente.emails.send({
    from: REMETENTE,
    to: destino,
    subject: `ANDRADE: digest da semana (${d.totais.leads} leads)`,
    html,
  });
  if (error) console.log("[emails] falha no digest:", error.message);
}

export type DadosNotificacaoLead = {
  numero: number | null;
  nome?: string | null;
  contato?: string | null;
  contatoTipo?: string | null;
  segmento: string;
  objetivo: string;
  caminho: Caminho;
  faixaMin: number;
  faixaMax: number;
  temperatura: string;
  score: number;
  urlEstimativa: string | null;
};

export async function enviarNotificacaoInterna(
  d: DadosNotificacaoLead,
): Promise<void> {
  const cliente = resend();
  const destino = process.env.ADMIN_EMAIL;
  if (!cliente || !destino) {
    if (!destino) console.log("[emails] ADMIN_EMAIL ausente: notificação pulada");
    return;
  }

  const quem = d.nome || "Lead anônimo";
  const assunto = `Novo lead ${d.temperatura}: ${quem} (${faixaPorExtenso(d.faixaMin, d.faixaMax)})`;

  const html = moldura(`
    <h1 style="${estiloTitulo}">Novo lead no Diagnóstico${d.numero ? ` (Nº ${d.numero})` : ""}</h1>
    <div style="${estiloDestaque}">
      Nome: <strong>${quem}</strong><br>
      Contato: <strong>${d.contato ? `${d.contato} (${d.contatoTipo})` : "não informado"}</strong><br>
      Temperatura: <strong>${d.temperatura}</strong> (score ${d.score})
    </div>
    <p style="${estiloTexto}">
      Segmento: ${d.segmento}<br>
      Objetivo: ${d.objetivo}<br>
      Caminho: ${ROTULO_CAMINHO[d.caminho]}<br>
      Faixa: ${faixaPorExtenso(d.faixaMin, d.faixaMax)}
    </p>
    ${
      d.urlEstimativa
        ? `<p style="${estiloTexto}"><a href="${d.urlEstimativa}" style="color:#8a6d2f;">Abrir estimativa pública</a></p>`
        : ""
    }
  `);

  const { error } = await cliente.emails.send({
    from: REMETENTE,
    to: destino,
    subject: assunto,
    html,
  });
  if (error) console.log("[emails] falha na notificação interna:", error.message);
}

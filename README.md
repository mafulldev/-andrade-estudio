# ANDRADE, Estúdio digital

Plataforma completa do estúdio de Matheus de Andrade: site institucional
imersivo, Diagnóstico com motor de orçamento determinístico, captação e
gestão de leads com CRM próprio, automações de e-mail e notificação, e cinco
sites de demonstração com identidade própria. Tudo rodando em free tiers
reais; o único custo opcional é um domínio próprio.

Sumaré, SP. Desde 2024. Remoto para o Brasil inteiro.

## Arquitetura

- **Next.js 15** (App Router, TypeScript estrito) na **Vercel Hobby**
- **Supabase Free**: Postgres com RLS, Auth por magic link para o admin
- **Resend Free**: e-mails transacionais (estimativa, follow-up, notificação, digest)
- **Telegram Bot API** (opcional): notificação instantânea de lead
- **Cloudflare Turnstile Free** (opcional em dev): anti-spam invisível
- **GSAP + Lenis**: movimento; **WebGL puro**: o fundo vivo (shader autoral)
- Design system autoral em CSS custom properties **OKLCH** + CSS Modules; sem Tailwind, sem UI kit

Rotas principais: `/` (home), `/diagnostico` (consultor), `/estimativa/[id]`
(estimativa pública permanente), `/admin` (CRM), `/demos/{brasa|vitta|foro|prumo|solar}`,
`/privacidade`, mais as APIs em `/api/lead`, `/api/evento`, `/api/admin/*` e
`/api/cron/*`.

### As 9 automações

1. **Captura total**: todo diagnóstico concluído vira lead, mesmo sem contato.
2. **Scoring automático** com temperatura (quente, morno, frio).
3. **E-mail da estimativa** ao lead, com link permanente.
4. **Notificação interna** por e-mail e, se configurado, **Telegram**.
5. **Follow-up único de 48h** (cron diário), só com consentimento, carimbado para nunca repetir.
6. **Keep-alive do Supabase** no mesmo cron: o projeto free não pausa por inatividade.
7. **Digest semanal** (segunda-feira) com leads, funil e nichos.
8. **Funil de eventos próprio**: 10 tipos de evento em banco seu, sem mensalidade de analytics.
9. **Anti-spam invisível**: Turnstile no servidor, honeypot e tempo mínimo de preenchimento.

## Setup do zero

### 1. Supabase (banco e auth)

1. Crie um projeto em [supabase.com](https://supabase.com) (free).
2. No painel, abra **SQL Editor** e rode o conteúdo de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
3. Em **Project Settings > API**, copie a URL do projeto, a chave `anon` e a
   chave `service_role` para o `.env.local`.
4. **Usuário admin**: em **Authentication > Users > Add user**, crie
   manualmente o usuário com o e-mail do `ADMIN_EMAIL` (marque
   auto-confirm). Em **Authentication > Sign In / Up**, **desabilite o
   signup** (Allow new users to sign up: off). O login do admin também envia
   `shouldCreateUser: false`, então só esse usuário entra.
5. Em **Authentication > URL Configuration**, adicione
   `http://localhost:3000/admin/login` e a URL de produção
   (`https://seu-projeto.vercel.app/admin/login`) como Redirect URLs.

### 2. Resend (e-mails)

1. Crie uma conta em [resend.com](https://resend.com) (free: 3.000/mês, 100/dia).
2. Gere uma API key e preencha `RESEND_API_KEY`.
3. Sem domínio próprio, os envios saem do domínio sandbox da Resend
   (`onboarding@resend.dev`). Com domínio, verifique-o no painel da Resend,
   configure os registros DNS e troque o remetente em
   [`lib/emails.ts`](lib/emails.ts).

### 3. Telegram (opcional)

1. Fale com o `@BotFather` no Telegram, crie um bot (`/newbot`) e copie o
   token para `TELEGRAM_BOT_TOKEN`.
2. Envie qualquer mensagem para o seu bot e abra
   `https://api.telegram.org/bot<TOKEN>/getUpdates` para descobrir o
   `chat.id`; preencha `TELEGRAM_CHAT_ID`.
3. Sem esses envs, o recurso fica desligado sem erro.

### 4. Turnstile (opcional, recomendado em produção)

1. Em [dash.cloudflare.com](https://dash.cloudflare.com) > Turnstile, crie um
   widget **invisível** para o seu domínio.
2. Preencha `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.
3. Sem os envs (dev), a checagem é pulada com aviso no log do servidor.

### 5. Rodar local

```bash
cp .env.example .env.local   # preencha o que tiver; tudo opcional degrada sem erro
npm install
npm run dev                  # http://localhost:3000
npm run selftest             # motor de orçamento: 4 cenários, exige PASS
```

## Deploy na Vercel

1. Suba o repositório para o GitHub e importe na Vercel (plano Hobby).
2. Em **Settings > Environment Variables**, preencha todas as variáveis do
   `.env.example`, incluindo `NEXT_PUBLIC_SITE_URL` com a URL final e um
   `CRON_SECRET` aleatório longo.
3. Os crons do [`vercel.json`](vercel.json) são registrados no deploy:
   diário às 12h UTC (follow-up + keep-alive) e segunda às 11h UTC (digest).
   A Vercel envia `Authorization: Bearer CRON_SECRET` automaticamente.
   No Hobby, crons rodam no máximo uma vez por dia, o que é exatamente o desenho.
4. Atualize a Redirect URL do Supabase com o domínio final (passo 1.5).

## Como editar

- **Preços e prazos**: `PRICING` e `PRAZOS` em [`lib/motor.ts`](lib/motor.ts).
  Depois de qualquer mudança, atualize os valores esperados em
  [`scripts/selftest.ts`](scripts/selftest.ts) e rode `npm run selftest`:
  nada é publicado com FAIL.
- **Copy da home**: [`app/page.tsx`](app/page.tsx) (FAQ, manifesto, timeline,
  inclusos, showcase). Perguntas do Diagnóstico: [`lib/rotulos.ts`](lib/rotulos.ts).
- **Fotos**: os placeholders usam `picsum.photos` com seeds estáveis; troque
  os `src` por suas fotos (mantendo `next/image`) e ajuste o
  `remotePatterns` em [`next.config.ts`](next.config.ts) se usar outro host.
- **Tokens de cor**: os dois temas do estúdio em [`app/globals.css`](app/globals.css);
  cada demo tem os seus no próprio `*.module.css`.

## Limites dos free tiers, ditos com honestidade

- **Vercel Hobby**: 2 crons, no máximo 1 execução diária cada; uso pessoal e
  não comercial nos termos do plano; funções serverless com cota generosa
  para este porte de site.
- **Supabase Free**: 500MB de Postgres; projetos pausam após 7 dias sem
  atividade, e o keep-alive do cron diário elimina esse risco.
- **Resend Free**: 3.000 e-mails/mês com teto de 100/dia; o follow-up
  processa no máximo 80 por dia para deixar folga.
- **Telegram**: gratuito e ilimitado.
- **WhatsApp**: a API oficial do WhatsApp **não é gratuita**. Por isso a
  automação de mensagens vai por e-mail e Telegram, e o WhatsApp permanece
  como handoff humano via links `wa.me` pré-preenchidos. Sem disfarce.

**Custo real de operação: zero.** O único custo opcional é um domínio próprio.

## Antes de publicar, revise

- A **política de privacidade** ([`app/privacidade/page.tsx`](app/privacidade/page.tsx)):
  prazos de retenção e canal de exclusão descrevem o comportamento do código,
  mas a palavra final é sua.
- As **duas políticas comerciais declaradas no FAQ** da home: a rodada única
  de ajustes inclusa nos modelos prontos e o domínio e hospedagem em nome do
  cliente configurados pelo estúdio. São promessas; confirme que quer
  assumi-las exatamente assim.

## Selftest

`npm run selftest` valida o motor com 4 cenários travados (A, B, C e D,
incluindo serialização). A regra da casa: nada é entregue com FAIL.

© 2026 ANDRADE, Estúdio digital. Projetado, construído e automatizado pelo
próprio estúdio.

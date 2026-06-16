# Colocar o ANDRADE no ar, checklist de producao

Guia passo a passo pra tirar o site do localhost e por no ar funcionando de
verdade: lead salvando no banco, e-mail automatico, notificacao no celular,
admin protegido e indexado no Google. Todos os servicos tem plano gratuito.

Marque cada item conforme for fazendo. Onde diz **(codigo)** e algo que eu
posso ajustar pra voce; o resto e clicar nos paineis com a sua conta.

---

## 0. O que ja esta pronto vs. o que voce provisiona

**Ja pronto no codigo (nao precisa mexer):**
- Funil completo: diagnostico, motor de orcamento, captura de lead, CRM no `/admin`.
- Rotas de API: `/api/lead`, `/api/evento`, `/api/admin/*`, `/api/cron/*`.
- Schema do banco pronto em `supabase/migrations/0001_init.sql` (com RLS).
- Sitemap (`/sitemap.xml`) e robots (`/robots.txt`) automaticos.
- Crons agendados em `vercel.json` (follow-up diario + digest semanal).
- Degradacao elegante: faltando uma variavel, o recurso desliga sem quebrar o site.

**Voce provisiona (contas + chaves):** Supabase, Resend, Vercel, dominio, e
opcionalmente Turnstile e Telegram. Os passos abaixo.

---

## 1. Contas necessarias (todas com free tier)

- [ ] **GitHub** (hospedar o codigo) - github.com
- [ ] **Vercel** (deploy + crons) - vercel.com, entre com o GitHub
- [ ] **Supabase** (banco + login do admin) - supabase.com
- [ ] **Resend** (e-mails) - resend.com
- [ ] **Cloudflare** (opcional, Turnstile anti-spam) - cloudflare.com
- [ ] **Dominio proprio** - registro.br (.com.br) ou similar. Custa ~R$40/ano.

---

## 2. Versionar o codigo (git + GitHub)

A Vercel faz deploy a cada `git push`. O projeto ainda nao e um repositorio git.

- [ ] Criar um repositorio **privado** no GitHub (ex.: `andrade-estudio`).
- [ ] No projeto, rodar:
  ```
  git init
  git add .
  git commit -m "ANDRADE, estudio digital"
  git branch -M main
  git remote add origin https://github.com/SEU_USUARIO/andrade-estudio.git
  git push -u origin main
  ```
  > O `.gitignore` ja existe e ignora `node_modules`, `.next` e `.env.local`,
  > entao suas chaves nunca vao pro GitHub. Me avise que eu rodo o `git init`
  > + primeiro commit pra voce.

---

## 3. Supabase (banco + login do admin)

- [ ] **New project**. Regiao: **South America (Sao Paulo)** = menor latencia no Brasil.
- [ ] Anote a senha do banco (guardar em lugar seguro).
- [ ] **SQL Editor** > New query > cole TODO o conteudo de
  `supabase/migrations/0001_init.sql` > **Run**. Isso cria as tabelas
  `leads` e `eventos` com RLS ligada (so o servidor escreve, via service role).
- [ ] **Project Settings > API**, copie estes tres valores:
  - `Project URL` -> vira `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key -> vira `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key (secreta!) -> vira `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Authentication > Providers > Email**: deixe **Email** habilitado
  (o login do admin e por magic link). Pode desligar "Confirm email" se quiser
  o link entrar direto.
- [ ] **Authentication > URL Configuration**: em **Site URL** ponha a URL final
  de producao (o dominio, depois do passo 8). Adicione a mesma em Redirect URLs.

> Seguranca do admin: so o e-mail definido em `ADMIN_EMAIL` consegue entrar no
> `/admin` (o servidor confere e devolve 403 pra qualquer outro). Use o seu
> e-mail real ali.

---

## 4. Resend (e-mails) - ATENCAO ao dominio

Esta e a unica pegadinha de verdade. Por padrao o codigo envia do remetente
sandbox `onboarding@resend.dev` (veja `lib/emails.ts`, linha 15).

**No sandbox, o Resend so entrega e-mail pra voce mesmo** (o e-mail da sua conta
Resend). Ou seja:
- A **notificacao de novo lead** chega pra voce normalmente (vai pro `ADMIN_EMAIL`). OK.
- Mas a **estimativa e o follow-up que iriam PRO LEAD nao saem** ate voce
  verificar um dominio. O lead nao recebe nada.

Passos:
- [ ] Criar conta no Resend > **API Keys** > criar chave -> vira `RESEND_API_KEY`.
- [ ] Para os e-mails chegarem aos leads: **Domains > Add Domain**, informe o seu
  dominio e adicione os registros DNS (SPF/DKIM) que eles mostram no painel do
  seu provedor de dominio. Espere verificar (alguns minutos a algumas horas).
- [ ] **(codigo)** Depois de verificado, trocar a linha 15 de `lib/emails.ts`
  para algo como `ANDRADE, Estudio digital <contato@seudominio.com.br>`.
  Me avise que eu faco essa troca.
- [ ] Definir `ADMIN_EMAIL` com o seu e-mail (recebe notificacao de lead + digest semanal).

> Free tier do Resend: 3.000 e-mails/mes, 100/dia. O cron ja respeita o limite
> diario (lote de 80).

---

## 5. Opcionais (recomendados, mas o site funciona sem)

**Turnstile (anti-spam invisivel da Cloudflare):**
- [ ] cloudflare.com > Turnstile > Add site > pegue **Site Key** e **Secret Key**.
- [ ] Viram `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.
- Sem isso, a checagem e pulada (sem erro), mas voce fica exposto a spam no form.

**Telegram (notificacao de lead na hora, no celular):**
- [ ] No app, fale com **@BotFather** > `/newbot` > pegue o **token**.
- [ ] Mande qualquer mensagem pro seu bot, depois pegue o seu **chat id**.
- [ ] Viram `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`.

---

## 6. Gerar o CRON_SECRET

Protege as rotas `/api/cron/*` (so a Vercel pode dispara-las).

- [ ] Gere um valor aleatorio longo. No terminal: `openssl rand -hex 32`
  (ou qualquer string aleatoria de 40+ caracteres).
- [ ] Vira `CRON_SECRET`. A Vercel manda esse segredo automaticamente nos crons
  quando a variavel existe; voce so precisa cadastra-la.

---

## 7. Deploy na Vercel + variaveis de ambiente

- [ ] Na Vercel: **Add New > Project** > importe o repositorio do GitHub.
- [ ] Framework: **Next.js** (detecta sozinho). Nao mude build command.
- [ ] **Environment Variables**: adicione TODAS as variaveis abaixo (em
  Production e Preview). Lista completa no fim deste arquivo.
- [ ] **Deploy**. Em ~1 min sai uma URL `*.vercel.app`.
- [ ] Os crons do `vercel.json` passam a rodar sozinhos (follow-up todo dia 12h
  UTC, digest segunda 11h UTC). No plano Hobby eles rodam ~1x/dia, aproximado.

---

## 8. Dominio proprio

- [ ] Registrar o dominio (ex.: `andradestudio.com.br`) no registro.br. **Esse
  passo e seu: e uma compra, eu nao posso fazer no seu lugar.**
- [ ] Na Vercel: **Project > Settings > Domains** > Add > digite o dominio e siga
  as instrucoes de DNS (apontar A/CNAME ou nameservers).
- [ ] Atualizar `NEXT_PUBLIC_SITE_URL` na Vercel para `https://seudominio.com.br`
  (sem barra no fim). Isso conserta sitemap, links de e-mail e a estimativa publica.
- [ ] Voltar no Supabase (passo 3) e por o dominio em **Site URL**.
- [ ] Verificar o dominio no Resend (passo 4) se ainda nao fez.

---

## 9. Indexacao no Google

Sem isso, ninguem te acha numa busca.

- [ ] **Google Search Console** (search.google.com/search-console): adicionar a
  propriedade do dominio, verificar, e enviar `https://seudominio.com.br/sitemap.xml`.
- [ ] **Perfil da Empresa no Google** (google.com/business): criar o perfil do
  estudio (Sumare/Campinas) - e o que faz aparecer em "criacao de site Sumare".

---

## 10. Teste de ponta a ponta em producao (smoke test)

Faca isso ANTES de divulgar. Tem que funcionar inteiro:

- [ ] Abrir o site no dominio, no celular e no desktop. Carrega rapido, sem erro.
- [ ] Preencher o **/diagnostico** ate o fim com um e-mail seu de teste.
- [ ] Conferir no Supabase (**Table Editor > leads**) que o lead apareceu.
- [ ] Conferir que **chegou a notificacao** de novo lead no seu e-mail (e no Telegram).
- [ ] Conferir que o **e-mail de estimativa chegou** no e-mail de teste do lead
  (so funciona com dominio Resend verificado, passo 4).
- [ ] Entrar no **/admin** com o seu e-mail (magic link) e ver o lead na lista.
- [ ] Abrir `/sitemap.xml` e `/robots.txt` e ver as URLs com o dominio certo.

Passou tudo? Esta no ar e pronto pra receber cliente.

---

## Lista de variaveis (cola na Vercel)

| Variavel | Obrigatoria | De onde vem |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sim | a URL final (dominio ou *.vercel.app) |
| `NEXT_PUBLIC_SUPABASE_URL` | sim | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | sim | Supabase > Settings > API (secreta) |
| `RESEND_API_KEY` | sim (p/ e-mails) | Resend > API Keys |
| `ADMIN_EMAIL` | sim | seu e-mail (notificacao + digest + login admin) |
| `CRON_SECRET` | sim | gere aleatorio (openssl rand -hex 32) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | opcional | Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | opcional | Cloudflare Turnstile |
| `TELEGRAM_BOT_TOKEN` | opcional | @BotFather |
| `TELEGRAM_CHAT_ID` | opcional | seu chat id |

> Caminho minimo pra ja receber lead com aviso: as 7 obrigatorias. Os e-mails
> aos leads dependem do dominio verificado no Resend (passo 4). O resto e ganho
> incremental.

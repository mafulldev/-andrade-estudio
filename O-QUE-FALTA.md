# O que falta da sua parte — passo a passo

Guia humano e em ordem do que ainda depende de você para o site começar a
funcionar e dar retorno. Marquei cada item com quem faz:

- 🟢 **[VOCÊ]** — só você pode (precisa da sua conta, do seu cartão ou da sua decisão).
- 🔵 **[ME CHAME]** — é técnico, eu faço por você quando você chegar nesse ponto.

O detalhe técnico fino de cada passo de publicação está no **[DEPLOY.md](DEPLOY.md)**.
Este arquivo é o mapa geral.

---

## Onde estamos hoje

✅ Site completo e testado: home, diagnóstico com motor de orçamento, CRM no `/admin`, automação de lead (e-mail + notificação).
✅ 5 demos (Brasa, Vitta, Foro, Prumo, Solar) com **imagens reais** já no lugar.
✅ Imagens da home, do 404 e da privacidade também reais.
✅ Código versionado no Git (2 commits prontos), build passando.

**Resumo do que falta:** o site está pronto para **captar**. Falta **(1) pôr no
ar de verdade**, **(2) trazer gente** e **(3) responder e fechar**. É só isso que
separa ele de começar a dar lucro.

---

## Antes de começar: contas e a única compra

Crie estas contas (todas **grátis**) com o seu e-mail. Pode criar todas de uma vez:

- 🟢 GitHub — github.com
- 🟢 Vercel — vercel.com (entre com o GitHub)
- 🟢 Supabase — supabase.com
- 🟢 Resend — resend.com
- 🟢 (opcional) Cloudflare — cloudflare.com

E a **única coisa paga**:

- 🟢 **Domínio próprio** (ex.: `andradestudio.com.br`) no **registro.br** — cerca de **R$ 40/ano**. Essa compra é sua; eu não posso fazer no seu lugar.

> ⚠️ Senhas, chaves de API e dados de cartão: **sempre você** digita, nos painéis
> oficiais. Eu nunca peço nem uso essas informações.

---

## FASE 1 — Pôr o site no ar
*(umas 1 a 2 horas do seu tempo, espalhadas; a maior parte é esperar verificação)*

### 1.1 — Subir o código no GitHub 🟢 [VOCÊ]
1. Crie um repositório **privado** em github.com/new (ex.: `andrade-estudio`), **sem** marcar README/.gitignore.
2. No terminal, dentro da pasta do projeto, rode (trocando `SEU_USUARIO`):
   ```
   git remote add origin https://github.com/SEU_USUARIO/andrade-estudio.git
   git push -u origin main
   ```
   Pronto: os 3 commits sobem juntos.

### 1.2 — Banco de dados (Supabase) 🟢 [VOCÊ]
1. **New project** — região **South America (São Paulo)**.
2. No **SQL Editor**, cole e rode o conteúdo de `supabase/migrations/0001_init.sql` (cria as tabelas de leads).
3. Em **Settings > API**, copie 3 valores: `Project URL`, `anon key`, `service_role key`.
4. Em **Authentication > URL Configuration**, ponha o seu domínio como Site URL (depois do passo 1.5).
> Para que serve: é onde cada lead do diagnóstico fica guardado, e o login do `/admin`.

### 1.3 — E-mails (Resend) 🟢 [VOCÊ] + 🔵 [ME CHAME]
1. Crie a conta, gere uma **API Key**.
2. ⚠️ **Importante:** para o e-mail de estimativa **chegar ao cliente**, você precisa **verificar um domínio** no Resend (em **Domains**, adicionar registros DNS). Sem isso, só você recebe a notificação de lead, o cliente não recebe nada.
3. 🔵 **Quando o domínio estiver verificado, me chame**: eu troco o remetente no código (1 linha) para sair do seu domínio.
> Para que serve: manda a estimativa para o lead, o follow-up de 48h e o resumo semanal para você.

### 1.4 — Publicar na Vercel 🟢 [VOCÊ]
1. **Add New > Project** e importe o repositório do GitHub.
2. Em **Environment Variables**, cole **todas** as variáveis (a lista completa está no fim do **[DEPLOY.md](DEPLOY.md)**): as do Supabase, a do Resend, o seu `ADMIN_EMAIL`, e um `CRON_SECRET` aleatório.
3. **Deploy**. Em ~1 minuto sai um endereço `*.vercel.app` no ar.
> Para que serve: é o que hospeda o site e roda as automações (follow-up diário, resumo semanal).

### 1.5 — Domínio próprio 🟢 [VOCÊ]
1. Compre o domínio no registro.br.
2. Na Vercel, **Settings > Domains > Add**, e siga as instruções de DNS.
3. Atualize a variável `NEXT_PUBLIC_SITE_URL` na Vercel para `https://seudominio.com.br`.
4. Volte no Supabase (1.2) e no Resend (1.3) e ponha o domínio onde for pedido.

---

## FASE 2 — Testar se funciona 🟢 [VOCÊ]
*(15 minutos, antes de divulgar)*

Faça o caminho do cliente, de ponta a ponta, no domínio de verdade:
1. [ ] Abrir o site no celular e no computador — carrega rápido, sem erro.
2. [ ] Preencher o **/diagnostico** até o fim com um e-mail seu de teste.
3. [ ] Conferir no Supabase (**Table Editor > leads**) que o lead apareceu.
4. [ ] Conferir que **chegou a notificação** de lead no seu e-mail.
5. [ ] Conferir que o **e-mail de estimativa** chegou no endereço de teste (depende do passo 1.3).
6. [ ] Entrar no **/admin** com o seu e-mail e ver o lead na lista.

> 🔵 Se algo falhar aqui, **me chame**: eu leio os logs do deploy e conserto.

---

## FASE 3 — Aparecer no Google 🟢 [VOCÊ]
*(sem isso, ninguém te acha numa busca)*

1. [ ] **Google Search Console** (search.google.com/search-console): adicionar o domínio, verificar e enviar `https://seudominio.com.br/sitemap.xml`.
2. [ ] **Perfil da Empresa no Google** (google.com/business): criar o perfil do estúdio (Sumaré/Campinas). É o que faz aparecer em buscas tipo "criação de site Sumaré".

---

## FASE 4 — Trazer clientes 🟢 [VOCÊ]
*(é aqui que o lucro de verdade aparece; é contínuo)*

Site no ar sem visita = R$ 0. Em ordem do que traz cliente mais rápido para um estúdio de uma pessoa:

1. [ ] **Prospecção ativa** (mais rápido para a 1ª venda): liste negócios de Sumaré/Campinas sem site ou com site ruim e ofereça. Use o diferencial "no ar em 1 dia útil" e mande o link do diagnóstico.
2. [ ] **Indicação**: peça a cada cliente satisfeito o nome de mais um.
3. [ ] **Anúncio pago pequeno** (Google/Meta, R$ 10 a 20 por dia) mirando "criação de site para [nicho]".
4. [ ] **Conteúdo/portfólio**: mostre os 5 modelos e os projetos reais conforme forem saindo.

---

## FASE 5 — Responder e fechar 🟢 [VOCÊ]
*(o site capta; quem fecha é você)*

1. [ ] Responder cada lead **rápido** (a notificação por e-mail já te avisa na hora).
2. [ ] Cumprir o que o site promete (proposta clara, prazo).
3. [ ] Conforme entregar para clientes reais, me peça para **adicionar os depoimentos verdadeiros** no site (é o que mais aumenta a conversão).

---

## O que EU ainda posso fazer por você 🔵 [ME CHAME]

- Trocar o remetente do Resend assim que o domínio estiver verificado (1.3).
- Conferir o funil em produção e consertar o que aparecer nos logs.
- Botar um **analytics simples** para você ver de onde vêm os leads.
- Adicionar **depoimentos/casos reais** quando você tiver os primeiros clientes.
- Gerar imagens dedicadas para o 404 e a privacidade, se um dia quiser (hoje reaproveitam fotos do site).
- Qualquer ajuste de texto, seção ou conversão que você quiser testar.

---

## Por onde começar agora

A ordem é a deste arquivo: **1.1 → 1.2 → 1.3 → 1.4 → 1.5 → testar → Google → trazer cliente.**

O passo que **destrava tudo** é o **1.1 (subir no GitHub)** e o **1.4 (deploy na
Vercel)** — depois deles o site já está no ar num endereço `*.vercel.app`, mesmo
antes do domínio. Comece por aí. Qualquer travada, é só me chamar.

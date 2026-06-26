# O que falta da sua parte — passo a passo detalhado

Guia clique a clique. Feito para você não se perder: faça **um passo por vez** e,
ao terminar cada um, me chame que eu confiro antes de seguir para o próximo.

**Legenda:**
- 🟢 **[VOCÊ]** — só você pode fazer (sua conta, seu cartão, sua decisão).
- 🔵 **[ME CHAME]** — é técnico, eu faço por você. É só me avisar quando chegar.
- ✅ — já está feito.

**Regra de ouro:** nunca me mande senha, chave secreta ou número de cartão.
Você digita isso sozinho, nos sites oficiais. Eu nunca preciso ver.

---

## Onde estamos hoje

- ✅ Site completo e testado (home, diagnóstico, CRM no `/admin`, automações).
- ✅ 5 demos com imagens reais. Imagens da home, 404 e privacidade reais.
- ✅ Código no Git e **já publicado no GitHub**: [github.com/mafulldev/-andrade-estudio](https://github.com/mafulldev/-andrade-estudio)

**Falta, em ordem:** (1) pôr o site no ar de verdade, (2) testar, (3) aparecer no
Google, (4) trazer clientes, (5) responder e fechar.

---

## Antes de tudo: contas e a única compra

Crie estas contas (todas **grátis**). **Use sempre o mesmo e-mail e, no GitHub,
sempre a conta `mafulldev`** — misturar conta foi o que travou o passo 1.1.

| Conta | Site | Para quê |
|---|---|---|
| GitHub | github.com | guardar o código *(já criada: `mafulldev`)* |
| Vercel | vercel.com | hospedar o site no ar |
| Supabase | supabase.com | banco de dados dos leads |
| Resend | resend.com | enviar os e-mails |
| Cloudflare *(opcional)* | cloudflare.com | anti-spam do formulário |

**A única coisa paga:** um **domínio** (ex.: `andradestudio.com.br`) no
**registro.br**, cerca de **R$ 40 por ano**. Essa compra é sua.

> Dica: ao criar Vercel e Supabase, escolha **"Continue with GitHub"** e entre
> com a conta `mafulldev`. Assim tudo fica amarrado na mesma conta.

---

# FASE 1 — Pôr o site no ar

São 5 passos: **1.1 → 1.2 → 1.3 → 1.4 → 1.5**. O 1.1 já está feito.
Faça os outros nesta ordem.

---

## 1.1 — Subir o código no GitHub ✅ CONCLUÍDO

O código já está em [github.com/mafulldev/-andrade-estudio](https://github.com/mafulldev/-andrade-estudio).
Nada a fazer aqui. *(Lição que vale para os próximos passos: sempre que o GitHub
pedir login, entre como `mafulldev`, não como outra conta.)*

> Opcional: o repositório está **público** (ficou assim durante o conserto do
> login). Se quiser deixá-lo **privado**: GitHub → seu repositório → **Settings**
> → role até **Danger Zone** → **Change visibility** → Private. O envio de código
> continua funcionando.

---

## 1.2 — Banco de dados (Supabase) 🟢 [VOCÊ]

É onde cada lead do diagnóstico fica guardado e de onde sai o login do `/admin`.
Quatro partes: **(A) criar o projeto, (B) criar as tabelas, (C) copiar as chaves,
(D) ligar o login do admin.**

### 1.2-A) Criar o projeto
1. Entre em **supabase.com** e clique em **"Start your project"** / **Sign in** (use **Continue with GitHub**, conta `mafulldev`).
2. No painel, clique no botão verde **"New project"**.
3. Preencha:
   - **Name:** `andrade` (ou o que quiser).
   - **Database Password:** clique em **Generate a password** e **guarde essa senha** num lugar seguro (você raramente vai usar, mas não dá pra recuperar).
   - **Region:** escolha **South America (São Paulo)** — servidor mais perto, site mais rápido no Brasil.
4. Clique em **"Create new project"**. Vai aparecer "Setting up project…". **Espere 1 a 2 minutos** até ficar pronto.

### 1.2-B) Criar as tabelas (rodar a "migration")
Cria as tabelas onde os leads são salvos. É copiar e colar um trecho de código.

1. No menu da **esquerda**, clique em **"SQL Editor"** (ícone `>_` ou escrito "SQL").
2. Clique em **"New query"** (ou no `+`).
3. Abra o arquivo do projeto que tem o código das tabelas:
   - No seu computador, vá em `C:\Users\macsa\Desktop\Nova pasta\supabase\migrations\`
   - Abra o arquivo **`0001_init.sql`** com o **Bloco de Notas** (clique direito → Abrir com → Bloco de Notas).
   - Selecione tudo (**Ctrl+A**) e copie (**Ctrl+C**).
   > Se preferir, me peça que eu **colo esse código aqui no chat** para você copiar direto, sem abrir arquivo.
4. Volte ao Supabase, **cole** (**Ctrl+V**) na área da query.
5. Clique no botão **"Run"** (canto inferior direito, ou **Ctrl+Enter**).
6. **O que você deve ver:** uma mensagem verde tipo **"Success. No rows returned"**. Deu certo.
   > Se aparecer erro em vermelho, **não mexa em nada e me chame** — cola o texto do erro aqui.

### 1.2-C) Copiar as 3 chaves de acesso
1. No menu da esquerda, lá embaixo, clique no **ícone de engrenagem** → **"Project Settings"**.
2. Dentro, clique em **"API"** (ou "API Keys" / "Data API").
3. Copie e **guarde num bloco de notas** estes três valores:

| O que copiar | Onde aparece | É segredo? |
|---|---|---|
| **Project URL** | "Project URL", tipo `https://abcdxyz.supabase.co` | não |
| **Chave `anon` `public`** | em "Project API keys", texto longo começando com `eyJ...` | não |
| **Chave `service_role` `secret`** | mesma seção, vem escondida (clique em **Reveal**), também começa com `eyJ...` | **SIM** |

> ⚠️ A chave **`service_role` é a chave-mestra do banco — trate como senha.**
> Você só vai colá-la depois, no painel da Vercel. Nunca em print nem no chat.
> Se o painel novo mostrar só "Publishable" e "Secret keys", procure a aba/seção
> com `anon` e `service_role` (as que começam com `eyJ`); são essas.

### 1.2-D) Ligar o login do admin
O `/admin` entra por "link mágico" enviado ao seu e-mail. Para funcionar:
1. Menu esquerdo → **"Authentication"** → **"Providers"** (ou "Sign In / Providers").
2. Confirme que **"Email"** está **ativado** (Enabled). Não precisa mexer em mais nada agora.
3. O **Site URL** desta área a gente acerta no passo 1.4-D (depois que o site tiver endereço). Por ora, só deixe o Email ligado.

✋ **Pare aqui e me chame.** Eu confiro com você se as tabelas e as chaves estão certas antes de seguir.

---

## 1.3 — E-mails (Resend) 🟢 [VOCÊ] + 🔵 [ME CHAME]

É o que dispara a estimativa para o cliente, o follow-up de 48h e o seu resumo semanal.

### 1.3-A) Criar a conta e a chave
1. Entre em **resend.com** e crie a conta (pode usar **Continue with GitHub**, `mafulldev`).
2. No menu esquerdo, clique em **"API Keys"**.
3. Clique em **"Create API Key"**. Dê um nome (ex.: `andrade`), deixe permissão **Full access**, clique em **Add**.
4. Vai aparecer uma chave começando com **`re_...`**. **Copie e guarde agora** — ela só é mostrada uma vez. Essa é a `RESEND_API_KEY`.

### 1.3-B) Verificar o domínio (para o e-mail chegar no cliente)
⚠️ Sem isso, o Resend só entrega e-mail **para você mesmo**: a notificação de lead
chega, mas a **estimativa não chega ao cliente**. Para liberar:
1. No Resend, menu esquerdo → **"Domains"** → **"Add Domain"**.
2. Digite o seu domínio (ex.: `andradestudio.com.br`) e confirme.
3. O Resend vai mostrar uns **registros DNS** (códigos SPF/DKIM). Você cola esses códigos no painel de onde comprou o domínio (registro.br) — **mais fácil fazer junto com o passo 1.5 (domínio)**.
4. 🔵 **Quando o domínio aparecer como "Verified" no Resend, me chame:** eu troco uma linha no código (`lib/emails.ts`) para os e-mails saírem do seu domínio.

> Pode fazer a parte A agora (criar a chave) e deixar a parte B (verificar
> domínio) para quando estiver mexendo no domínio. Sem a parte B o site **funciona**
> e você **recebe** os leads; só o e-mail automático ao cliente que fica esperando.

✋ **Me chame quando tiver a chave `re_...` guardada.**

---

## 1.4 — Publicar na Vercel 🟢 [VOCÊ]

Aqui o site sai do seu computador e vai para o ar.

### 1.4-A) Importar o repositório
1. Entre em **vercel.com** com **"Continue with GitHub"** (conta `mafulldev`).
2. No painel, clique em **"Add New…"** → **"Project"**.
3. Vai listar seus repositórios. Ache **`-andrade-estudio`** e clique em **"Import"**.
   > Se não aparecer, clique em **"Adjust GitHub App Permissions"** e dê acesso ao repositório.
4. A Vercel já reconhece que é **Next.js**. **Não mude** Build Command nem Output. Antes de publicar, preencha as variáveis (parte B) — **ainda não clique em Deploy**.

### 1.4-B) Colar as variáveis de ambiente
Ainda nessa tela, abra **"Environment Variables"**. Para cada linha abaixo, digite
o **Name** (exatamente como está) e cole o **Value**, e clique em **Add**:

| Name (copie exato) | Value (de onde vem) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase (passo 1.2-C) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave `anon` (1.2-C) |
| `SUPABASE_SERVICE_ROLE_KEY` | chave `service_role` (1.2-C) — a secreta |
| `RESEND_API_KEY` | a chave `re_...` (1.3-A) |
| `ADMIN_EMAIL` | **o seu e-mail** (onde quer receber aviso de lead e por onde entra no `/admin`) |
| `CRON_SECRET` | um código aleatório (veja abaixo como gerar) |

**Como gerar o `CRON_SECRET`:** abra o **PowerShell** e rode esta linha; copie o resultado:
```
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```
> Esse código só protege as automações. Você cola o mesmo valor aqui e pronto; a Vercel cuida do resto sozinha. Se preferir, **me peça que eu gero um para você.**

*(As variáveis de Telegram e Turnstile são opcionais — pule por enquanto, o site funciona sem.)*

### 1.4-C) Publicar
1. Clique em **"Deploy"**. Aguarde ~1 a 2 minutos ("Building…").
2. Ao terminar, a Vercel mostra **"Congratulations"** e um endereço tipo **`andrade-estudio.vercel.app`**. **Abra esse endereço:** o site já está no ar! 🎉

### 1.4-D) Avisar o site qual é o endereço dele (importante)
Falta uma variável que depende do endereço que acabou de nascer:
1. Na Vercel: **Settings → Environment Variables** do projeto.
2. Adicione: Name `NEXT_PUBLIC_SITE_URL`, Value o endereço que apareceu (ex.: `https://andrade-estudio.vercel.app`, **sem barra no final**).
3. Aba **"Deployments"** → no deploy mais recente, **três pontinhos** → **"Redeploy"**. Isso aplica a variável.
4. Volte no **Supabase** (passo 1.2-D) → Authentication → **URL Configuration** → ponha esse mesmo endereço em **Site URL** (faz o link mágico do `/admin` funcionar).

✋ **Me chame com o endereço `.vercel.app`** que eu testo o funil com você (formulário → lead salvo → e-mails).

---

## 1.5 — Domínio próprio 🟢 [VOCÊ]
*(opcional para testar, necessário para o cliente confiar)*

1. Compre o domínio no **registro.br** (ex.: `andradestudio.com.br`).
2. Na Vercel: **Settings → Domains → Add**, digite o domínio e siga as instruções de DNS que a Vercel mostrar (você cola esses dados no painel do registro.br).
3. No registro.br, aproveite e cole também os registros **DNS do Resend** (passo 1.3-B).
4. Na Vercel, troque a variável `NEXT_PUBLIC_SITE_URL` para `https://seudominio.com.br` e faça **Redeploy**.
5. Atualize o **Site URL** no Supabase (1.2-D) para o domínio.

🔵 **Pode me chamar nesta fase** — DNS confunde bastante, eu te ajudo a conferir se está tudo apontando certo.

---

# FASE 2 — Testar se funciona 🟢 [VOCÊ]
*(15 minutos, antes de divulgar para qualquer pessoa)*

Faça o caminho do cliente de ponta a ponta, no endereço de verdade:
1. [ ] Abrir o site no **celular e no computador** — carrega rápido, sem erro.
2. [ ] Preencher o **/diagnostico** até o fim, usando um **e-mail seu de teste**.
3. [ ] No Supabase, **Table Editor → tabela `leads`**: o seu teste apareceu lá?
4. [ ] Chegou a **notificação de lead** no seu e-mail (`ADMIN_EMAIL`)?
5. [ ] Chegou o **e-mail de estimativa** no e-mail de teste? *(só funciona depois do domínio verificado no Resend, 1.3-B)*
6. [ ] Entrar no **/admin** com o seu e-mail (link mágico) e ver o lead na lista.

> 🔵 Qualquer item que falhar: **me chame**. Eu leio os logs do deploy e conserto.

---

# FASE 3 — Aparecer no Google 🟢 [VOCÊ]
*(sem isso, ninguém te encontra numa busca)*

1. [ ] **Google Search Console** (search.google.com/search-console): adicione o domínio, verifique a posse e envie o sitemap: `https://seudominio.com.br/sitemap.xml`.
2. [ ] **Perfil da Empresa no Google** (google.com/business): crie o perfil do estúdio (Sumaré/Campinas). É o que faz você aparecer em buscas tipo "criação de site Sumaré".

---

# FASE 4 — Trazer clientes 🟢 [VOCÊ]
*(é aqui que o lucro aparece de verdade; é contínuo)*

Site no ar sem visita = R$ 0. Do que traz cliente mais rápido para um estúdio de uma pessoa:
1. [ ] **Prospecção ativa** (a 1ª venda vem mais rápido daqui): liste negócios de Sumaré/Campinas sem site ou com site ruim, e ofereça. Use o diferencial "no ar em 1 dia útil" e mande o link do diagnóstico.
2. [ ] **Indicação:** peça a cada cliente satisfeito o nome de mais um.
3. [ ] **Anúncio pago pequeno** (Google/Meta, R$ 10 a 20 por dia) mirando "criação de site para [nicho]".
4. [ ] **Portfólio:** mostre os 5 modelos e os projetos reais conforme saírem.

---

# FASE 5 — Responder e fechar 🟢 [VOCÊ]
*(o site capta; quem fecha é você)*

1. [ ] Responder cada lead **rápido** (a notificação por e-mail te avisa na hora).
2. [ ] Cumprir o que o site promete (proposta clara, prazo combinado).
3. [ ] 🔵 Conforme entregar para clientes reais, me peça para **colocar os depoimentos verdadeiros** no site — é o que mais aumenta a conversão.

---

## O que EU faço por você 🔵 [ME CHAME]

- Gerar o `CRON_SECRET` para você (1.4-B).
- Colar aqui o conteúdo da migration, se preferir não abrir o arquivo (1.2-B).
- Trocar o remetente do Resend quando o domínio estiver verificado (1.3-B).
- Testar o funil em produção com você e consertar o que aparecer nos logs (Fase 2).
- Conferir o DNS do domínio (1.5).
- Botar um analytics simples (de onde vêm os leads).
- Adicionar depoimentos/casos reais quando você tiver os primeiros clientes.

---

## Por onde começar AGORA

O 1.1 (GitHub) já está feito. **Seu próximo passo é o 1.2 (Supabase), parte A:
criar o projeto.**

Faça um passo por vez. Ao terminar cada um, **me chame** que eu confiro antes de
seguir. Não precisa decorar nada — é só seguir esta lista de cima para baixo.

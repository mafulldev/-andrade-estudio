-- =============================================================================
-- ANDRADE, Estúdio digital — migração inicial
-- Tabelas de leads e de eventos do funil próprio.
--
-- Segurança: RLS HABILITADA nas duas tabelas SEM nenhuma policy para anon ou
-- authenticated. Toda leitura e escrita passa pelas rotas de API no servidor,
-- usando a service role (que ignora RLS por definição). A chave service role
-- jamais aparece no cliente.
-- =============================================================================

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  -- Nº sequencial do diagnóstico, exibido na mini-proposta e nos e-mails.
  -- O id público permanece uuid; o numero nunca é usado como chave de acesso.
  numero bigint generated always as identity,
  created_at timestamptz not null default now(),

  -- identificação (opcional: lead anônimo vale para o funil)
  nome text,
  contato_tipo text check (contato_tipo in ('whatsapp', 'email')),
  contato text,

  -- briefing do diagnóstico
  segmento text,
  objetivo text,
  funcionalidades jsonb default '[]'::jsonb,
  prazo text,
  investimento text,

  -- resultado do motor avaliar()
  caminho text,
  categoria text,
  faixa_min int,
  faixa_max int,
  prazo_estimado text,

  -- scoring automático
  score int,
  temperatura text check (temperatura in ('quente', 'morno', 'frio')),

  -- gestão no CRM
  status text default 'novo' check (status in ('novo', 'contatado', 'proposta', 'fechado', 'perdido')),
  consentimento boolean default false,
  origem text,
  notas text,
  followup_enviado_em timestamptz
);

create table public.eventos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tipo text,
  pagina text,
  meta jsonb default '{}'::jsonb,
  lead_id uuid null references public.leads (id)
);

create index leads_status_idx on public.leads (status);
create index leads_created_at_idx on public.leads (created_at);
create index eventos_tipo_idx on public.eventos (tipo);
create index eventos_created_at_idx on public.eventos (created_at);

alter table public.leads enable row level security;
alter table public.eventos enable row level security;

-- Sem policies de propósito: anon e authenticated não leem nem escrevem
-- diretamente nas tabelas. O acesso é exclusivo das rotas de API no servidor.

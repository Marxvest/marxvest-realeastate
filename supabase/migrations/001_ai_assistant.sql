create extension if not exists vector;

create table if not exists public.ai_estates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  category text,
  description text,
  features text[] default '{}',
  payment_plan text,
  title_document text,
  starting_price text,
  whatsapp_message text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  source text default 'website',
  page_url text,
  status text default 'open',
  started_at timestamptz default now(),
  last_message_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  model text,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

create table if not exists public.ai_leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.ai_conversations(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  estate_interest text,
  budget text,
  buying_purpose text,
  timeline text,
  conversation_summary text,
  source text default 'website_assistant',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.ai_knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  source text default 'manual',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.ai_knowledge_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.ai_estates enable row level security;
alter table public.ai_faqs enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_leads enable row level security;
alter table public.ai_knowledge_documents enable row level security;
alter table public.ai_knowledge_chunks enable row level security;

create policy "Public can read active estates"
on public.ai_estates for select
using (is_active = true);

create policy "Public can read published faqs"
on public.ai_faqs for select
using (is_published = true);

insert into public.ai_estates (
  name,
  location,
  category,
  description,
  payment_plan,
  title_document,
  starting_price,
  is_active
)
values
  (
    'Kings Court Estate',
    'FUNAAB Alabata Road, Ogun State',
    'Residential / Investment',
    'A Marxvest estate option around the FUNAAB Alabata axis.',
    'Flexible payment plan available. Confirm details with a consultant.',
    'Registered survey, deed of assignment',
    'From NGN 2.5M per plot',
    true
  ),
  (
    'Billionaires Court Estate',
    'Ikorodu Ogijo-Sagamu Konigbagbe axis',
    'Residential / Investment',
    'A Marxvest estate option around the Ikorodu, Ogijo and Sagamu growth corridor.',
    'Flexible payment plan available. Confirm details with a consultant.',
    'Survey plan, deed package, allocation after full payment',
    'Premium quote on request',
    true
  ),
  (
    'EverRich Farmland',
    'Ntoji, Ogunmakin, Ogun State',
    'Farmland / Agriculture / Investment',
    'A Marxvest farmland investment option at Ntoji, Ogunmakin, Ogun State.',
    'Flexible payment plan available. Confirm details with a consultant.',
    'Site chart, purchase agreement, allocation after settlement',
    'From NGN 950K per parcel',
    true
  )
on conflict do nothing;

insert into public.ai_faqs (question, answer, sort_order)
values
  (
    'What estates does Marxvest currently offer?',
    'Marxvest currently presents Kings Court Estate, Billionaires Court Estate, and EverRich Farmland. A consultant should confirm current availability before purchase.',
    1
  ),
  (
    'Does Marxvest offer installment payment?',
    'Marxvest mentions flexible payment options. Exact payment duration, deposit, and balance terms should be confirmed by a Marxvest consultant.',
    2
  ),
  (
    'Can I inspect the land before buying?',
    'Yes, interested buyers should speak with a Marxvest consultant to arrange an inspection.',
    3
  ),
  (
    'How do I contact Marxvest?',
    'You can contact Marxvest on WhatsApp or phone via +2349114712695 or email info@marxvestspec.com.',
    4
  ),
  (
    'What documents will I receive after purchase?',
    'Document details should be confirmed by a Marxvest consultant before purchase. The assistant should not invent legal title information.',
    5
  )
on conflict do nothing;

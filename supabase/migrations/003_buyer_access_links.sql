create table if not exists public.buyer_access_links (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone_full text not null,
  buyer_phone_last4 text not null,
  estate_name text not null,
  drive_folder_id text not null,
  token_hash text not null unique,
  status text not null default 'active' check (status in ('active', 'revoked', 'expired', 'used')),
  delivery_channel text not null default 'manual' check (delivery_channel in ('email', 'whatsapp', 'manual')),
  delivery_note text,
  payment_note text,
  expires_at timestamptz not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_accessed_at timestamptz,
  access_count integer not null default 0
);

create index if not exists buyer_access_links_status_idx
  on public.buyer_access_links (status);

create index if not exists buyer_access_links_expires_at_idx
  on public.buyer_access_links (expires_at);

create index if not exists buyer_access_links_created_at_idx
  on public.buyer_access_links (created_at desc);

create table if not exists public.buyer_access_attempts (
  id uuid primary key default gen_random_uuid(),
  buyer_access_link_id uuid references public.buyer_access_links(id) on delete set null,
  attempt_status text not null check (attempt_status in ('success', 'failed_verification', 'expired', 'revoked', 'invalid_token')),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists buyer_access_attempts_link_id_idx
  on public.buyer_access_attempts (buyer_access_link_id);

create index if not exists buyer_access_attempts_created_at_idx
  on public.buyer_access_attempts (created_at desc);

alter table public.buyer_access_links enable row level security;
alter table public.buyer_access_attempts enable row level security;

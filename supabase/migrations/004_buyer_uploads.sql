insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'buyer-uploads',
  'buyer-uploads',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create table if not exists public.buyer_uploads (
  id uuid primary key default gen_random_uuid(),
  buyer_access_link_id uuid not null references public.buyer_access_links(id) on delete cascade,
  buyer_name text not null,
  buyer_email text not null,
  file_name text not null,
  file_path text not null unique,
  file_type text not null,
  file_size bigint not null,
  upload_category text not null check (upload_category in ('payment_receipt', 'passport_photo', 'government_id', 'signed_document', 'other')),
  note text,
  review_status text not null default 'pending' check (review_status in ('pending', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists buyer_uploads_buyer_access_link_id_idx
  on public.buyer_uploads (buyer_access_link_id);

create index if not exists buyer_uploads_review_status_idx
  on public.buyer_uploads (review_status);

create index if not exists buyer_uploads_created_at_idx
  on public.buyer_uploads (created_at desc);

alter table public.buyer_uploads enable row level security;

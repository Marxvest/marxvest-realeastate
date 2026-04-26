create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  coming_from text not null,
  preferred_date date not null,
  listing_slug text not null,
  listing_title text,
  reminder_channel text not null check (reminder_channel in ('Email', 'Phone call', 'WhatsApp')),
  referral_source text not null,
  message text,
  preparation_acknowledged boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_requests_created_at_idx
  on public.booking_requests (created_at desc);

create index if not exists booking_requests_status_idx
  on public.booking_requests (status);

create index if not exists booking_requests_listing_slug_idx
  on public.booking_requests (listing_slug);

alter table public.booking_requests enable row level security;

create table if not exists public.partner_registrations (
  id uuid primary key default gen_random_uuid(),
  surname text not null,
  other_names text not null,
  marital_status text not null,
  phone text not null,
  date_of_birth date not null,
  residential_address text not null,
  occupation text not null,
  email text not null,
  upline_name text not null,
  account_details text not null,
  affirmation text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partner_registrations_created_at_idx
  on public.partner_registrations (created_at desc);

create index if not exists partner_registrations_status_idx
  on public.partner_registrations (status);

alter table public.partner_registrations enable row level security;

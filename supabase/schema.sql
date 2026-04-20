create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  estate_name text not null,
  land_type text not null,
  location text not null,
  state text not null,
  price_label text not null,
  status text not null,
  summary text not null,
  description text not null,
  hero_image text not null,
  gallery jsonb not null default '[]'::jsonb,
  plot_sizes jsonb not null default '[]'::jsonb,
  documentation jsonb not null default '[]'::jsonb,
  payment_eligibility text not null,
  featured boolean not null default false,
  coordinates_hint text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.homepage_banners (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null,
  title text not null,
  body text not null,
  cta_label text not null,
  cta_href text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  message text not null,
  preferred_contact_method text not null,
  review_status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key,
  role text not null check (role in ('buyer', 'staff', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.buyer_approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  listing_id uuid not null references public.listings(id) on delete cascade,
  approval_status text not null default 'approved',
  assigned_plan_type text not null check (assigned_plan_type in ('full', 'installment')),
  approved_at timestamptz not null default now()
);

create table if not exists public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  listing_id uuid not null references public.listings(id) on delete cascade,
  type text not null check (type in ('full', 'installment')),
  total_amount_naira bigint not null,
  deposit_percent integer not null default 30,
  installment_months integer not null default 6,
  balance_remaining_naira bigint not null,
  status text not null default 'approved' check (status in ('approved', 'active', 'fully_paid', 'defaulted', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_installments (
  id uuid primary key default gen_random_uuid(),
  payment_plan_id uuid not null references public.payment_plans(id) on delete cascade,
  installment_number integer not null,
  label text not null,
  amount_naira bigint not null,
  due_at timestamptz,
  paid_at timestamptz,
  receipt_id uuid,
  status text not null default 'upcoming' check (status in ('pending', 'due', 'paid', 'upcoming', 'waived', 'overdue')),
  unique (payment_plan_id, installment_number)
);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  payment_plan_id uuid not null references public.payment_plans(id) on delete cascade,
  installment_id uuid references public.payment_installments(id) on delete set null,
  expected_amount_naira bigint not null,
  provider text not null default 'paystack' check (provider in ('paystack')),
  provider_reference text not null unique,
  provider_transaction_id text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  verification_reason text,
  channel text,
  paid_at timestamptz,
  webhook_event_id text,
  raw_callback_payload jsonb,
  raw_webhook_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  payment_attempt_id uuid not null unique references public.payment_attempts(id) on delete restrict,
  payment_plan_id uuid not null references public.payment_plans(id) on delete cascade,
  installment_id uuid references public.payment_installments(id) on delete set null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  listing_slug text not null,
  estate_name text not null,
  amount_naira bigint not null,
  balance_before_naira bigint not null,
  balance_after_naira bigint not null,
  payment_label text not null,
  receipt_number text not null unique,
  provider_reference text not null,
  provider_transaction_id text,
  paid_at timestamptz not null default now(),
  generated_at timestamptz not null default now(),
  file_url text,
  file_hash text,
  template_version integer not null default 1,
  stamp_asset_version integer not null default 1,
  status text not null default 'active' check (status in ('active', 'voided', 'regenerated')),
  generated_by text not null default 'system'
);

create table if not exists public.allocation_records (
  id uuid primary key default gen_random_uuid(),
  payment_plan_id uuid not null unique references public.payment_plans(id) on delete cascade,
  status text not null default 'locked',
  eligible_at timestamptz,
  allocated_at timestamptz,
  allocated_by text,
  completed_at timestamptz
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  subject text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.buyer_approvals enable row level security;
alter table public.payment_plans enable row level security;
alter table public.payment_installments enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.payment_receipts enable row level security;
alter table public.allocation_records enable row level security;
alter table public.inquiries enable row level security;
alter table public.audit_events enable row level security;

create policy "buyers can read their approvals"
on public.buyer_approvals
for select
using (auth.uid() = user_id);

create policy "buyers can read their payment plans"
on public.payment_plans
for select
using (auth.uid() = user_id);

create policy "buyers can read their installments"
on public.payment_installments
for select
using (
  exists (
    select 1
    from public.payment_plans
    where public.payment_plans.id = public.payment_installments.payment_plan_id
      and public.payment_plans.user_id = auth.uid()
  )
);

create policy "buyers can read their receipts"
on public.payment_receipts
for select
using (
  exists (
    select 1
    from public.payment_plans
    where public.payment_plans.id = public.payment_receipts.payment_plan_id
      and public.payment_plans.user_id = auth.uid()
  )
);

create policy "buyers can read their allocation records"
on public.allocation_records
for select
using (
  exists (
    select 1
    from public.payment_plans
    where public.payment_plans.id = public.allocation_records.payment_plan_id
      and public.payment_plans.user_id = auth.uid()
  )
);

alter table if exists public.payment_plans
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.payment_installments
  add column if not exists paid_at timestamptz;

alter table if exists public.payment_installments
  add column if not exists receipt_id uuid;

alter table if exists public.payment_attempts
  add column if not exists installment_id uuid references public.payment_installments(id) on delete set null;

alter table if exists public.payment_attempts
  add column if not exists provider text not null default 'paystack';

alter table if exists public.payment_attempts
  add column if not exists provider_transaction_id text;

alter table if exists public.payment_attempts
  add column if not exists verification_reason text;

alter table if exists public.payment_attempts
  add column if not exists channel text;

alter table if exists public.payment_attempts
  add column if not exists paid_at timestamptz;

alter table if exists public.payment_attempts
  add column if not exists webhook_event_id text;

alter table if exists public.payment_attempts
  add column if not exists raw_callback_payload jsonb;

alter table if exists public.payment_attempts
  add column if not exists raw_webhook_payload jsonb;

alter table if exists public.payment_attempts
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.payment_receipts
  add column if not exists payment_attempt_id uuid references public.payment_attempts(id) on delete restrict;

alter table if exists public.payment_receipts
  add column if not exists installment_id uuid references public.payment_installments(id) on delete set null;

alter table if exists public.payment_receipts
  add column if not exists buyer_name text;

alter table if exists public.payment_receipts
  add column if not exists buyer_email text;

alter table if exists public.payment_receipts
  add column if not exists buyer_phone text;

alter table if exists public.payment_receipts
  add column if not exists listing_slug text;

alter table if exists public.payment_receipts
  add column if not exists estate_name text;

alter table if exists public.payment_receipts
  add column if not exists balance_before_naira bigint;

alter table if exists public.payment_receipts
  add column if not exists balance_after_naira bigint;

alter table if exists public.payment_receipts
  add column if not exists payment_label text;

alter table if exists public.payment_receipts
  add column if not exists provider_reference text;

alter table if exists public.payment_receipts
  add column if not exists provider_transaction_id text;

alter table if exists public.payment_receipts
  add column if not exists generated_at timestamptz not null default now();

alter table if exists public.payment_receipts
  add column if not exists file_url text;

alter table if exists public.payment_receipts
  add column if not exists file_hash text;

alter table if exists public.payment_receipts
  add column if not exists template_version integer not null default 1;

alter table if exists public.payment_receipts
  add column if not exists stamp_asset_version integer not null default 1;

alter table if exists public.payment_receipts
  add column if not exists status text not null default 'active';

alter table if exists public.payment_receipts
  add column if not exists generated_by text not null default 'system';

alter table if exists public.allocation_records
  add column if not exists allocated_at timestamptz;

alter table if exists public.allocation_records
  add column if not exists allocated_by text;

create unique index if not exists payment_receipts_payment_attempt_id_key
  on public.payment_receipts (payment_attempt_id)
  where payment_attempt_id is not null;

create or replace function public.process_verified_payment(
  p_reference text,
  p_payment_plan_id uuid,
  p_listing_slug text,
  p_installment_id uuid default null,
  p_expected_amount_naira bigint default null,
  p_provider_transaction_id text default null,
  p_channel text default null,
  p_paid_at timestamptz default null,
  p_webhook_event_id text default null,
  p_raw_webhook_payload jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.payment_attempts%rowtype;
  v_plan public.payment_plans%rowtype;
  v_listing public.listings%rowtype;
  v_installment public.payment_installments%rowtype;
  v_receipt public.payment_receipts%rowtype;
  v_allocation public.allocation_records%rowtype;
  v_now timestamptz := coalesce(p_paid_at, now());
  v_balance_before bigint;
  v_balance_after bigint;
  v_payment_label text;
  v_receipt_number text;
  v_file_hash text;
begin
  select *
  into v_attempt
  from public.payment_attempts
  where provider_reference = p_reference
  for update;

  if not found then
    raise exception 'No pending payment attempt matches this reference.';
  end if;

  if v_attempt.payment_plan_id <> p_payment_plan_id then
    raise exception 'Payment plan mismatch for verified payment.';
  end if;

  if p_expected_amount_naira is not null and v_attempt.expected_amount_naira <> p_expected_amount_naira then
    raise exception 'Expected amount mismatch for verified payment.';
  end if;

  if coalesce(v_attempt.installment_id::text, '') <> coalesce(p_installment_id::text, '') then
    raise exception 'Installment mismatch for verified payment.';
  end if;

  if v_attempt.verification_status = 'verified' then
    select *
    into v_receipt
    from public.payment_receipts
    where payment_attempt_id = v_attempt.id;

    if found then
      select *
      into v_allocation
      from public.allocation_records
      where payment_plan_id = p_payment_plan_id;

      return jsonb_build_object(
        'receipt', jsonb_build_object(
          'id', v_receipt.id,
          'paymentAttemptId', v_receipt.payment_attempt_id,
          'paymentPlanId', v_receipt.payment_plan_id,
          'installmentId', v_receipt.installment_id,
          'buyerName', v_receipt.buyer_name,
          'buyerEmail', v_receipt.buyer_email,
          'buyerPhone', v_receipt.buyer_phone,
          'listingSlug', v_receipt.listing_slug,
          'estateName', v_receipt.estate_name,
          'amountNaira', v_receipt.amount_naira,
          'balanceBeforeNaira', v_receipt.balance_before_naira,
          'balanceAfterNaira', v_receipt.balance_after_naira,
          'paymentLabel', v_receipt.payment_label,
          'receiptNumber', v_receipt.receipt_number,
          'providerReference', v_receipt.provider_reference,
          'providerTransactionId', v_receipt.provider_transaction_id,
          'paidAt', v_receipt.paid_at,
          'generatedAt', v_receipt.generated_at,
          'fileUrl', v_receipt.file_url,
          'fileHash', v_receipt.file_hash,
          'templateVersion', v_receipt.template_version,
          'stampAssetVersion', v_receipt.stamp_asset_version,
          'status', v_receipt.status,
          'generatedBy', v_receipt.generated_by
        ),
        'allocation', jsonb_build_object(
          'id', coalesce(v_allocation.id, gen_random_uuid()),
          'paymentPlanId', p_payment_plan_id,
          'status', coalesce(v_allocation.status, 'locked'),
          'eligibleAt', v_allocation.eligible_at,
          'allocatedAt', v_allocation.allocated_at,
          'allocatedBy', v_allocation.allocated_by
        ),
        'paymentAttempt', jsonb_build_object(
          'id', v_attempt.id,
          'paymentPlanId', v_attempt.payment_plan_id,
          'installmentId', v_attempt.installment_id,
          'expectedAmountNaira', v_attempt.expected_amount_naira,
          'provider', v_attempt.provider,
          'providerReference', v_attempt.provider_reference,
          'providerTransactionId', v_attempt.provider_transaction_id,
          'verificationStatus', v_attempt.verification_status,
          'verificationReason', v_attempt.verification_reason,
          'channel', v_attempt.channel,
          'paidAt', v_attempt.paid_at,
          'webhookEventId', v_attempt.webhook_event_id,
          'createdAt', v_attempt.created_at,
          'updatedAt', v_attempt.updated_at
        ),
        'idempotent', true
      );
    end if;
  end if;

  select *
  into v_plan
  from public.payment_plans
  where id = p_payment_plan_id
  for update;

  if not found then
    raise exception 'Payment plan not found for verified payment.';
  end if;

  select *
  into v_listing
  from public.listings
  where slug = p_listing_slug;

  if not found then
    raise exception 'Listing not found for verified payment.';
  end if;

  if p_installment_id is not null then
    select *
    into v_installment
    from public.payment_installments
    where id = p_installment_id
    for update;

    if not found then
      raise exception 'Installment not found for verified payment.';
    end if;

    if v_installment.amount_naira <> v_attempt.expected_amount_naira then
      raise exception 'Installment amount does not match the verified payment amount.';
    end if;

    v_payment_label := v_installment.label;
  else
    v_payment_label := 'Full settlement';
  end if;

  v_balance_before := v_plan.balance_remaining_naira;

  if v_balance_before < v_attempt.expected_amount_naira then
    raise exception 'Verified payment amount exceeds remaining balance.';
  end if;

  v_balance_after := greatest(0, v_balance_before - v_attempt.expected_amount_naira);

  update public.payment_plans
  set
    balance_remaining_naira = v_balance_after,
    status = case when v_balance_after = 0 then 'fully_paid' else 'active' end,
    updated_at = now()
  where id = v_plan.id
  returning * into v_plan;

  if p_installment_id is not null then
    update public.payment_installments
    set
      status = 'paid',
      paid_at = v_now
    where id = p_installment_id
    returning * into v_installment;
  end if;

  update public.payment_attempts
  set
    provider_transaction_id = coalesce(p_provider_transaction_id, provider_transaction_id),
    verification_status = 'verified',
    verification_reason = null,
    channel = coalesce(p_channel, channel),
    paid_at = v_now,
    webhook_event_id = coalesce(p_webhook_event_id, webhook_event_id),
    raw_webhook_payload = coalesce(p_raw_webhook_payload, raw_webhook_payload),
    updated_at = now()
  where id = v_attempt.id
  returning * into v_attempt;

  v_receipt_number := concat(
    'MVS-REC-',
    to_char(v_now, 'YYYYMMDD'),
    '-',
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  );

  v_file_hash := encode(
    digest(concat(v_receipt_number, ':', p_reference), 'sha256'),
    'hex'
  );

  insert into public.payment_receipts (
    payment_attempt_id,
    payment_plan_id,
    installment_id,
    buyer_name,
    buyer_email,
    buyer_phone,
    listing_slug,
    estate_name,
    amount_naira,
    balance_before_naira,
    balance_after_naira,
    payment_label,
    receipt_number,
    provider_reference,
    provider_transaction_id,
    paid_at,
    generated_at,
    file_hash,
    template_version,
    stamp_asset_version,
    status,
    generated_by
  )
  values (
    v_attempt.id,
    v_attempt.payment_plan_id,
    v_attempt.installment_id,
    'Verified Buyer',
    'receipt@pending.local',
    null,
    p_listing_slug,
    v_listing.estate_name,
    v_attempt.expected_amount_naira,
    v_balance_before,
    v_balance_after,
    v_payment_label,
    v_receipt_number,
    p_reference,
    p_provider_transaction_id,
    v_now,
    now(),
    v_file_hash,
    1,
    1,
    'active',
    'system'
  )
  returning * into v_receipt;

  if p_installment_id is not null then
    update public.payment_installments
    set receipt_id = v_receipt.id
    where id = p_installment_id;
  end if;

  insert into public.allocation_records (
    payment_plan_id,
    status,
    eligible_at
  )
  values (
    p_payment_plan_id,
    case when v_balance_after = 0 then 'eligible' else 'locked' end,
    case when v_balance_after = 0 then v_now else null end
  )
  on conflict (payment_plan_id) do update
  set
    status = excluded.status,
    eligible_at = excluded.eligible_at
  returning * into v_allocation;

  insert into public.audit_events (actor, action, subject, metadata)
  values
    (
      'Paystack webhook',
      'payment_verified',
      p_payment_plan_id::text,
      jsonb_build_object(
        'providerReference', p_reference,
        'paymentAttemptId', v_attempt.id,
        'receiptNumber', v_receipt.receipt_number,
        'amountNaira', v_attempt.expected_amount_naira
      )
    ),
    (
      'system',
      'receipt_issued',
      v_receipt.receipt_number,
      jsonb_build_object(
        'paymentPlanId', p_payment_plan_id,
        'providerReference', p_reference,
        'templateVersion', 1,
        'stampAssetVersion', 1
      )
    );

  return jsonb_build_object(
    'receipt', jsonb_build_object(
      'id', v_receipt.id,
      'paymentAttemptId', v_receipt.payment_attempt_id,
      'paymentPlanId', v_receipt.payment_plan_id,
      'installmentId', v_receipt.installment_id,
      'buyerName', v_receipt.buyer_name,
      'buyerEmail', v_receipt.buyer_email,
      'buyerPhone', v_receipt.buyer_phone,
      'listingSlug', v_receipt.listing_slug,
      'estateName', v_receipt.estate_name,
      'amountNaira', v_receipt.amount_naira,
      'balanceBeforeNaira', v_receipt.balance_before_naira,
      'balanceAfterNaira', v_receipt.balance_after_naira,
      'paymentLabel', v_receipt.payment_label,
      'receiptNumber', v_receipt.receipt_number,
      'providerReference', v_receipt.provider_reference,
      'providerTransactionId', v_receipt.provider_transaction_id,
      'paidAt', v_receipt.paid_at,
      'generatedAt', v_receipt.generated_at,
      'fileUrl', v_receipt.file_url,
      'fileHash', v_receipt.file_hash,
      'templateVersion', v_receipt.template_version,
      'stampAssetVersion', v_receipt.stamp_asset_version,
      'status', v_receipt.status,
      'generatedBy', v_receipt.generated_by
    ),
    'allocation', jsonb_build_object(
      'id', v_allocation.id,
      'paymentPlanId', v_allocation.payment_plan_id,
      'status', v_allocation.status,
      'eligibleAt', v_allocation.eligible_at,
      'allocatedAt', v_allocation.allocated_at,
      'allocatedBy', v_allocation.allocated_by
    ),
    'paymentAttempt', jsonb_build_object(
      'id', v_attempt.id,
      'paymentPlanId', v_attempt.payment_plan_id,
      'installmentId', v_attempt.installment_id,
      'expectedAmountNaira', v_attempt.expected_amount_naira,
      'provider', v_attempt.provider,
      'providerReference', v_attempt.provider_reference,
      'providerTransactionId', v_attempt.provider_transaction_id,
      'verificationStatus', v_attempt.verification_status,
      'verificationReason', v_attempt.verification_reason,
      'channel', v_attempt.channel,
      'paidAt', v_attempt.paid_at,
      'webhookEventId', v_attempt.webhook_event_id,
      'createdAt', v_attempt.created_at,
      'updatedAt', v_attempt.updated_at
    ),
    'idempotent', false
  );
end;
$$;

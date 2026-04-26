alter table public.buyer_uploads
  add column if not exists mirror_status text not null default 'pending'
    check (mirror_status in ('pending', 'mirrored', 'failed'));

alter table public.buyer_uploads
  add column if not exists google_drive_file_id text;

alter table public.buyer_uploads
  add column if not exists google_drive_file_url text;

alter table public.buyer_uploads
  add column if not exists mirrored_at timestamptz;

alter table public.buyer_uploads
  add column if not exists mirror_error text;

create index if not exists buyer_uploads_mirror_status_idx
  on public.buyer_uploads (mirror_status);

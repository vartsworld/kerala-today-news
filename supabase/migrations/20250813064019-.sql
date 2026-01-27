-- Create table to store Facebook Page connection settings (manual connect)
create table if not exists public.facebook_settings (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  access_token text not null,
  page_name text,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.facebook_settings enable row level security;

-- Policies: only admins can manage/read settings
create policy if not exists "Admins can view facebook settings"
  on public.facebook_settings
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can insert facebook settings"
  on public.facebook_settings
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update facebook settings"
  on public.facebook_settings
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete facebook settings"
  on public.facebook_settings
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Keep updated_at fresh
create or replace trigger set_facebook_settings_updated_at
before update on public.facebook_settings
for each row
execute function public.update_updated_at_column();
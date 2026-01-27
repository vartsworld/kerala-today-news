-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- 1) Roles infrastructure
create type public.app_role as enum ('admin','editor','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- RLS: allow users to read their own roles
create policy "Users can read their own roles" on public.user_roles
for select to authenticated
using (auth.uid() = user_id);

-- RLS: only admins can manage roles
create policy "Admins can manage roles" on public.user_roles
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 2) Editorials content
create type public.editorial_status as enum ('draft','published');

create table public.editorials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  excerpt text,
  cover_image_url text,
  status public.editorial_status not null default 'draft',
  published_at timestamptz,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_editorials_status_published_at on public.editorials (status, published_at desc);

alter table public.editorials enable row level security;

-- Update updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_editorials_updated_at
before update on public.editorials
for each row execute function public.update_updated_at_column();

-- RLS Policies for editorials
-- Public can read published editorials
create policy "Public can read published editorials"
on public.editorials for select to anon, authenticated
using (status = 'published');

-- Admins can read everything
create policy "Admins can read all editorials"
on public.editorials for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Admins can insert/update/delete
create policy "Admins can insert editorials"
on public.editorials for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update editorials"
on public.editorials for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete editorials"
on public.editorials for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

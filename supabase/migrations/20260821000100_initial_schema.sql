create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  phone text not null default '',
  status text not null default 'active',
  plan text not null default 'Free',
  ai_credits integer not null default 0 check (ai_credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.bots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text not null default '',
  source text not null default 'uploaded',
  market text not null default 'deriv',
  xml text not null,
  status text not null default 'draft',
  credits_used integer not null default 0 check (credits_used >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.deriv_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  login_id text not null,
  account_type text not null default 'Demo',
  currency text not null default 'USD',
  balance numeric(14, 2) not null default 0,
  api_token text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.hosting_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_by text not null,
  brand jsonb not null,
  domains text[] not null default '{}',
  chosen_domain text,
  status text not null default 'pending',
  amount_usd numeric(10, 2) not null default 0,
  paid boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bot_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bot_id uuid references public.bots(id) on delete set null,
  bot_name text not null,
  symbol text not null,
  stake numeric(14, 2) not null default 0,
  martingale numeric(14, 2) not null default 0,
  take_profit numeric(14, 2) not null default 0,
  stop_loss numeric(14, 2) not null default 0,
  status text not null default 'running',
  profit numeric(14, 2) not null default 0,
  started_at timestamptz not null default now(),
  stopped_at timestamptz
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.bot_runs(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  contract_id text,
  contract_type text not null,
  symbol text not null,
  stake numeric(14, 2) not null default 0,
  payout numeric(14, 2) not null default 0,
  profit numeric(14, 2) not null default 0,
  status text not null default 'open',
  entry_spot numeric(18, 8),
  exit_spot numeric(18, 8),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null,
  units text not null,
  usd numeric(10, 2) not null default 0,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.package_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid references public.packages(id) on delete set null,
  amount_usd numeric(10, 2) not null default 0,
  status text not null default 'pending',
  payment_method text,
  created_at timestamptz not null default now()
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    updated_at = now();

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create index if not exists bots_user_created_idx on public.bots(user_id, created_at desc);
create index if not exists deriv_accounts_user_idx on public.deriv_accounts(user_id);
create index if not exists hosting_requests_user_created_idx on public.hosting_requests(user_id, created_at desc);
create index if not exists bot_runs_user_started_idx on public.bot_runs(user_id, started_at desc);
create index if not exists trades_user_created_idx on public.trades(user_id, created_at desc);
create index if not exists package_purchases_user_created_idx on public.package_purchases(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.bots enable row level security;
alter table public.deriv_accounts enable row level security;
alter table public.hosting_requests enable row level security;
alter table public.bot_runs enable row level security;
alter table public.trades enable row level security;
alter table public.admin_settings enable row level security;
alter table public.packages enable row level security;
alter table public.package_purchases enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can read own roles" on public.user_roles;
create policy "Users can read own roles" on public.user_roles
for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage roles" on public.user_roles;
create policy "Admins can manage roles" on public.user_roles
for all using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own bots" on public.bots;
create policy "Users can manage own bots" on public.bots
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own deriv account" on public.deriv_accounts;
create policy "Users can manage own deriv account" on public.deriv_accounts
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own hosting requests" on public.hosting_requests;
create policy "Users can manage own hosting requests" on public.hosting_requests
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own bot runs" on public.bot_runs;
create policy "Users can manage own bot runs" on public.bot_runs
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own trades" on public.trades;
create policy "Users can manage own trades" on public.trades
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage settings" on public.admin_settings;
create policy "Admins can manage settings" on public.admin_settings
for all using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Anyone authenticated can read active packages" on public.packages;
create policy "Anyone authenticated can read active packages" on public.packages
for select using (active = true or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage packages" on public.packages;
create policy "Admins can manage packages" on public.packages
for all using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users can manage own purchases" on public.package_purchases;
create policy "Users can manage own purchases" on public.package_purchases
for all using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

insert into public.packages (name, kind, units, usd, sort_order)
values
  ('Starter', 'AI Credits', '30 credits', 4.99, 10),
  ('Builder', 'AI Credits', '65 credits', 9.99, 20),
  ('Pro', 'AI Credits', '150 credits', 19.99, 30),
  ('Website Basic', 'Site', '1 site + subdomain', 29.00, 40),
  ('Website Pro', 'Site', '1 site + custom domain', 59.00, 50),
  ('Signal Bot Order', 'AI Signals', '1 signal bot', 39.00, 60)
on conflict do nothing;

-- PassVault PostgreSQL Database Schema
-- Compatible with Supabase (Auth + PostgreSQL + Row Level Security)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. Profiles Table (1:1 with auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 2. Credentials Table (1:many with auth.users)
-- ==============================================================================
create table if not exists public.credentials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  website_name text not null,
  website_url text default ''::text,
  category text default 'Other'::text,
  username_email text not null,
  encrypted_password text not null,
  notes text default ''::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index on website_name & username_email for fast searches
create index if not exists idx_credentials_user_id on public.credentials(user_id);
create index if not exists idx_credentials_website_name on public.credentials(website_name);
create index if not exists idx_credentials_category on public.credentials(category);

-- ==============================================================================
-- 3. Password Generator Settings Table (1:1 with auth.users)
-- ==============================================================================
create table if not exists public.password_generator_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  password_length integer default 16 not null,
  uppercase_enabled boolean default true not null,
  lowercase_enabled boolean default true not null,
  numbers_enabled boolean default true not null,
  symbols_enabled boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. Automatic updated_at Trigger
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_credentials_updated_at
  before update on public.credentials
  for each row execute function public.handle_updated_at();

create trigger set_generator_settings_updated_at
  before update on public.password_generator_settings
  for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 5. Row Level Security (RLS) Policies
-- Enforcing auth.uid() = user_id on all operations
-- ==============================================================================

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "own profile select" on public.profiles
  for select using (auth.uid() = user_id);

create policy "own profile insert" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "own profile update" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own profile delete" on public.profiles
  for delete using (auth.uid() = user_id);

-- Credentials RLS
alter table public.credentials enable row level security;

create policy "own credentials select" on public.credentials
  for select using (auth.uid() = user_id);

create policy "own credentials insert" on public.credentials
  for insert with check (auth.uid() = user_id);

create policy "own credentials update" on public.credentials
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own credentials delete" on public.credentials
  for delete using (auth.uid() = user_id);

-- Password Generator Settings RLS
alter table public.password_generator_settings enable row level security;

create policy "own settings select" on public.password_generator_settings
  for select using (auth.uid() = user_id);

create policy "own settings insert" on public.password_generator_settings
  for insert with check (auth.uid() = user_id);

create policy "own settings update" on public.password_generator_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own settings delete" on public.password_generator_settings
  for delete using (auth.uid() = user_id);

-- ==============================================================================
-- 6. Trigger to automatically create profile record on Supabase auth signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'PassVault User'),
    new.email
  );
  insert into public.password_generator_settings (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Migration: Add category column to credentials table safely
-- PassVault Assignment 8 Full-Stack Integration

do $$
begin
  -- Add category column if not already present
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'credentials'
      and column_name = 'category'
  ) then
    alter table public.credentials add column category text default 'Other'::text;
  end if;
end $$;

-- Create index for fast category filtering if not exists
create index if not exists idx_credentials_category on public.credentials(category);

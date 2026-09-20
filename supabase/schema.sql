-- Wilpattu Megha Safari - run this once in the Supabase SQL editor.

create table if not exists public.packages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  duration     text not null default '',        -- e.g. "4.5 hours"
  schedule     text not null default '',        -- e.g. "Morning 6:00am - 10:30am / Evening 1:30pm - 6:00pm"
  description  text not null default '',
  inclusions   text[] not null default '{}',
  sort_order   int  not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.package_prices (
  id          uuid primary key default gen_random_uuid(),
  package_id  uuid not null references public.packages(id) on delete cascade,
  label       text not null,                    -- e.g. "2-3 persons"
  price       numeric(10,2) not null check (price >= 0),
  price_to    numeric(10,2) check (price_to >= 0), -- optional: for ranges such as $70 - $60
  unit        text not null default 'per person',
  sort_order  int not null default 0
);

create index if not exists package_prices_package_id_idx on public.package_prices(package_id);

-- Row level security: the public can read active packages; only a signed-in user can change anything.
alter table public.packages enable row level security;
alter table public.package_prices enable row level security;

drop policy if exists "public read active packages" on public.packages;
create policy "public read active packages" on public.packages
  for select using (is_active or auth.role() = 'authenticated');

drop policy if exists "admin write packages" on public.packages;
create policy "admin write packages" on public.packages
  for all to authenticated using (true) with check (true);

drop policy if exists "public read prices" on public.package_prices;
create policy "public read prices" on public.package_prices
  for select using (
    exists (select 1 from public.packages p
            where p.id = package_id and (p.is_active or auth.role() = 'authenticated'))
  );

drop policy if exists "admin write prices" on public.package_prices;
create policy "admin write prices" on public.package_prices
  for all to authenticated using (true) with check (true);

-- IMPORTANT: in Supabase Dashboard -> Authentication -> Sign In / Providers,
-- turn OFF "Allow new users to sign up", then create the single admin user
-- under Authentication -> Users -> Add user (auto-confirm).

-- Seed data copied from the current website
with half as (
  insert into public.packages (name, duration, schedule, description, inclusions, sort_order)
  values (
    'Half Day Safari', '4.5 hours',
    'Morning 6:00am - 10:30am  |  Evening 1:30pm - 6:00pm',
    'A relaxed half-day game drive through Wilpattu''s lakes and forest trails with an experienced tracker.',
    array['Entrance ticket','Park taxes','Bird guide book reference','Mammals guide book reference','Cool box','Refreshment pack','Hotel pick up and drop off (within 7km)'],
    1)
  returning id
), full_ as (
  insert into public.packages (name, duration, schedule, description, inclusions, sort_order)
  values (
    'Full Day Safari', '10 hours',
    '6:00am - 6:00pm',
    'The complete Wilpattu experience: dawn to dusk with the best chance of leopard, sloth bear and elephant sightings.',
    array['Entrance ticket','Park taxes','Bird guide book reference','Mammals guide book reference','Cool box','Refreshment pack','Hotel pick up and drop off (within 7km)'],
    2)
  returning id
)
insert into public.package_prices (package_id, label, price, price_to, sort_order)
select id, '1 person', 100, null, 1 from half union all
select id, '2-3 persons', 70, 60, 2 from half union all
select id, '4-6 persons', 52, 45, 3 from half union all
select id, '1 person', 140, null, 1 from full_ union all
select id, '2-3 persons', 90, 75, 2 from full_ union all
select id, '4-6 persons', 65, 57, 3 from full_;

-- ============================================================
-- Europa Trip App — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text not null check (role in ('admin', 'member')) default 'member',
  phone       text unique,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Seed family members
insert into profiles (id, name, role, phone) values
  ('00000000-0000-0000-0000-000000000001', 'Sumit Sharma',      'admin',  '+919971752725'),
  ('00000000-0000-0000-0000-000000000002', 'Aishwarya Parashar','admin',  null),
  ('00000000-0000-0000-0000-000000000003', 'Mira Sharma',       'member', null),
  ('00000000-0000-0000-0000-000000000004', 'Dinesh Kumar',      'member', null),
  ('00000000-0000-0000-0000-000000000005', 'Chermanywati Sharma','member',null),
  ('00000000-0000-0000-0000-000000000006', 'Komal Sharma',      'member', null)
on conflict (id) do nothing;

-- ── Checklist lists ─────────────────────────────────────────
create table if not exists checklist_lists (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  type        text not null check (type in ('daily', 'packing', 'documents', 'custom')),
  created_at  timestamptz default now()
);

-- Seed lists
insert into checklist_lists (id, name, type) values
  ('10000000-0000-0000-0000-000000000001', 'Today''s tasks', 'daily'),
  ('10000000-0000-0000-0000-000000000002', 'Documents',      'documents'),
  ('10000000-0000-0000-0000-000000000003', 'Packing list',   'packing')
on conflict (id) do nothing;

-- ── Checklist items ─────────────────────────────────────────
create table if not exists checklist_items (
  id          uuid primary key default uuid_generate_v4(),
  list_id     uuid not null references checklist_lists(id) on delete cascade,
  text        text not null,
  checked     boolean not null default false,
  checked_by  uuid references profiles(id),
  checked_at  timestamptz,
  created_at  timestamptz default now()
);

create index if not exists checklist_items_list_id_idx on checklist_items(list_id);

-- Seed today's tasks
insert into checklist_items (list_id, text) values
  ('10000000-0000-0000-0000-000000000001', 'Pack day bag'),
  ('10000000-0000-0000-0000-000000000001', 'Passports on person'),
  ('10000000-0000-0000-0000-000000000001', 'Download offline maps'),
  ('10000000-0000-0000-0000-000000000001', 'Charge all devices'),
  ('10000000-0000-0000-0000-000000000001', 'Check weather'),
  ('10000000-0000-0000-0000-000000000001', 'Book any same-day tickets'),
  ('10000000-0000-0000-0000-000000000001', 'Note emergency numbers');

-- Seed documents
insert into checklist_items (list_id, text) values
  ('10000000-0000-0000-0000-000000000002', 'Passports (all 5)'),
  ('10000000-0000-0000-0000-000000000002', 'Schengen visa printouts'),
  ('10000000-0000-0000-0000-000000000002', 'Flight booking confirmations'),
  ('10000000-0000-0000-0000-000000000002', 'Train booking (ref W5UNRLKY)'),
  ('10000000-0000-0000-0000-000000000002', 'All Airbnb booking confirmations'),
  ('10000000-0000-0000-0000-000000000002', 'Travel insurance certificates (all 5)'),
  ('10000000-0000-0000-0000-000000000002', 'Emergency contact card (printed)'),
  ('10000000-0000-0000-0000-000000000002', 'Efteling tickets (once booked)');

-- ── Vibe posts ───────────────────────────────────────────────
create table if not exists vibe_posts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id),
  day_number  int not null check (day_number between 1 and 22),
  type        text not null check (type in ('photo', 'text')),
  content     text not null,
  sticker     text,
  created_at  timestamptz default now()
);

create index if not exists vibe_posts_day_number_idx on vibe_posts(day_number);

-- ── Day cards (admin-managed timeline) ──────────────────────
create table if not exists day_cards (
  id           uuid primary key default uuid_generate_v4(),
  day_number   int not null check (day_number between 1 and 22),
  type         text not null check (type in ('transport','stay','activity','ticket','alert','free')),
  title        text not null,
  description  text,
  time         text,
  image_url    text,
  document_url text,
  metadata     jsonb,
  created_at   timestamptz default now()
);

create index if not exists day_cards_day_number_idx on day_cards(day_number);

-- ── Row Level Security ───────────────────────────────────────
alter table profiles         enable row level security;
alter table checklist_lists  enable row level security;
alter table checklist_items  enable row level security;
alter table vibe_posts       enable row level security;
alter table day_cards        enable row level security;

-- Everyone can read all tables (trip members only, enforced via auth)
create policy "read all" on profiles        for select using (true);
create policy "read all" on checklist_lists for select using (true);
create policy "read all" on checklist_items for select using (true);
create policy "read all" on vibe_posts      for select using (true);
create policy "read all" on day_cards       for select using (true);

-- Anyone can toggle checklist items (Realtime sync)
create policy "anyone can update checklist" on checklist_items
  for update using (true) with check (true);

-- Anyone can insert vibe posts (they own their content)
create policy "insert own vibe" on vibe_posts
  for insert with check (true);

-- ── Realtime ────────────────────────────────────────────────
-- Enable Realtime for checklist_items (run in Supabase dashboard too)
-- alter publication supabase_realtime add table checklist_items;

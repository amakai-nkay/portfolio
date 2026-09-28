-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists sandboxes (
  id uuid primary key,
  api_key text not null unique,
  alert_email text,
  created_at timestamptz not null default now(),
  meta jsonb not null default '{"log": [], "alerts": []}'::jsonb
);

create table if not exists events (
  id uuid primary key,
  sandbox_id uuid not null references sandboxes(id) on delete cascade,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  source text not null check (source in ('seed', 'ui', 'api')),
  created_at timestamptz not null default now()
);

create index if not exists events_sandbox_created on events (sandbox_id, created_at);

-- The app talks to these tables only from the server, using the service role key.
-- Row level security with no policies means nobody else can read them.
alter table sandboxes enable row level security;
alter table events enable row level security;

-- Delete sandboxes (and their events and email addresses) after 7 days.
-- In Supabase: Database > Extensions > enable pg_cron, then run:
-- select cron.schedule('kova-cleanup', '0 3 * * *', $$delete from sandboxes where created_at < now() - interval '7 days'$$);

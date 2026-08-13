create extension if not exists pgcrypto;

create table if not exists public.career_assessment_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  phone_number text not null check (phone_number ~ '^[0-9]{10}$'),
  whatsapp_number text not null check (whatsapp_number ~ '^91[0-9]{10}$'),
  assigned_path text not null check (
    assigned_path in (
      'Game Development',
      'Cyber Security',
      'Mobile Development',
      'Web Development',
      'Artificial Intelligence & ML',
      'Data Science'
    )
  ),
  category text,
  answers jsonb not null default '{}'::jsonb,
  source text not null default 'landing',
  second_source text not null default 'direct' check (
    char_length(trim(second_source)) between 1 and 80
    and second_source ~ '^[[:alnum:]_ .:/-]+$'
  ),
  user_agent text,
  ip_hash text
);

create index if not exists career_assessment_leads_created_at_idx
  on public.career_assessment_leads (created_at desc);

create index if not exists career_assessment_leads_phone_number_idx
  on public.career_assessment_leads (phone_number);

create index if not exists career_assessment_leads_assigned_path_idx
  on public.career_assessment_leads (assigned_path);

create table if not exists public.career_assessment_delivery_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.career_assessment_leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  provider text not null check (provider in ('wati', 'salesmax_crm')),
  template_name text not null,
  status text not null check (status in ('sent', 'failed')),
  request jsonb not null default '{}'::jsonb,
  response jsonb not null default '{}'::jsonb,
  error text
);

create index if not exists career_assessment_delivery_events_lead_id_idx
  on public.career_assessment_delivery_events (lead_id);

create index if not exists career_assessment_delivery_events_created_at_idx
  on public.career_assessment_delivery_events (created_at desc);

alter table public.career_assessment_leads enable row level security;
alter table public.career_assessment_delivery_events enable row level security;

revoke all on table public.career_assessment_leads from anon, authenticated;
revoke all on table public.career_assessment_delivery_events from anon, authenticated;

grant usage on schema public to anon;
grant insert on table public.career_assessment_leads to anon;
grant insert on table public.career_assessment_delivery_events to anon;

drop policy if exists "Allow anonymous lead inserts" on public.career_assessment_leads;
create policy "Allow anonymous lead inserts"
  on public.career_assessment_leads
  for insert
  to anon
  with check (
    char_length(trim(name)) between 1 and 80
    and phone_number ~ '^[0-9]{10}$'
    and whatsapp_number = '91' || phone_number
    and char_length(trim(second_source)) between 1 and 80
    and second_source ~ '^[[:alnum:]_ .:/-]+$'
    and assigned_path in (
      'Game Development',
      'Cyber Security',
      'Mobile Development',
      'Web Development',
      'Artificial Intelligence & ML',
      'Data Science'
    )
  );

drop policy if exists "Allow anonymous delivery event inserts" on public.career_assessment_delivery_events;
create policy "Allow anonymous delivery event inserts"
  on public.career_assessment_delivery_events
  for insert
  to anon
  with check (
    provider in ('wati', 'salesmax_crm')
    and template_name in ('findyourdomain', 'salesmax_leads')
    and status in ('sent', 'failed')
  );

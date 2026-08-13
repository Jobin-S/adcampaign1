alter table public.career_assessment_delivery_events
  drop constraint if exists career_assessment_delivery_events_provider_check;

alter table public.career_assessment_delivery_events
  add constraint career_assessment_delivery_events_provider_check
  check (provider in ('wati', 'salesmax_crm'));

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

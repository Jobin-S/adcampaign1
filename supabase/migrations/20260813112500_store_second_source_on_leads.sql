alter table public.career_assessment_leads
  add column if not exists second_source text not null default 'direct';

alter table public.career_assessment_leads
  drop constraint if exists career_assessment_leads_second_source_check;

alter table public.career_assessment_leads
  add constraint career_assessment_leads_second_source_check
  check (
    char_length(trim(second_source)) between 1 and 80
    and second_source ~ '^[[:alnum:]_ .:/-]+$'
  );

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

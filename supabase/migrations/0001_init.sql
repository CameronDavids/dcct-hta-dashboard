create table if not exists public.hta_months (
  id text primary key,
  year int not null,
  month int not null check (month between 0 and 11),
  reach int,
  target int default 340,
  hiv_tests int,
  sti_treated int,
  condoms_male int default 42000,
  condoms_female int default 1500,
  outreaches int,
  support_groups int,
  note text,
  updated_at timestamptz default now()
);

alter table public.hta_months enable row level security;
create policy "Authenticated staff can manage HTA data" on public.hta_months
  for all to authenticated using (true) with check (true);

insert into public.hta_months (id, year, month, reach, target, hiv_tests, condoms_male, condoms_female, outreaches, support_groups)
values ('2026-04', 2026, 3, 545, 340, 52, 42000, 1500, 2, 2),
       ('2026-05', 2026, 4, 451, 340, 55, 42000, 1500, 1, 4),
       ('2026-06', 2026, 5, 245, 340, 29, 42000, 1500, 0, 6),
       ('2026-07', 2026, 6, 191, 340, 32, 42540, 1600, 1, 6),
       ('2026-08', 2026, 7, 331, 340, null, 42000, 1500, 2, 5)
on conflict (id) do update set reach = excluded.reach, target = excluded.target, hiv_tests = excluded.hiv_tests, condoms_male = excluded.condoms_male, condoms_female = excluded.condoms_female, outreaches = excluded.outreaches, support_groups = excluded.support_groups;
update public.hta_months set note = 'Groups resumed at Ndabeni' where id = '2026-05';
update public.hta_months set note = 'No outreach - gang violence in Parkwood' where id = '2026-06';
update public.hta_months set note = 'Wellness Day with Master Your Path (18 Jul)' where id = '2026-07';
update public.hta_months set sti_treated = 27 where id = '2026-08';

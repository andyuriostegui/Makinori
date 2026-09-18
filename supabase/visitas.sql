-- Maki Nori · visitas de la página (hoy / semana en el CRM)
-- Corre esto en SQL Editor de Supabase. Día = America/Mexico_City.

create table if not exists public.visitas (
  dia         date not null,
  visitor_id  text not null,
  hits        integer not null default 1,
  first_at    timestamptz not null default now(),
  last_at     timestamptz not null default now(),
  primary key (dia, visitor_id)
);

create index if not exists visitas_dia_idx on public.visitas (dia desc);

alter table public.visitas enable row level security;

revoke all on table public.visitas from anon, authenticated, public;
grant select on table public.visitas to authenticated;

drop policy if exists "Staff read visitas" on public.visitas;
create policy "Staff read visitas"
  on public.visitas for select
  to authenticated
  using (public.es_staff());

create or replace function public.registrar_visita(p_visitor_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  d date;
begin
  if p_visitor_id is null then
    return;
  end if;
  if p_visitor_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    return;
  end if;
  d := (timezone('America/Mexico_City', now()))::date;
  insert into public.visitas (dia, visitor_id, hits, first_at, last_at)
  values (d, lower(p_visitor_id), 1, now(), now())
  on conflict (dia, visitor_id)
  do update set
    hits = public.visitas.hits + 1,
    last_at = now();
end;
$$;

create or replace function public.resumen_visitas(p_dias integer default 14)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  hoy date;
  lunes date;
  desde date;
  out jsonb;
begin
  if not public.es_staff() then
    raise exception 'not allowed';
  end if;

  hoy := (timezone('America/Mexico_City', now()))::date;
  lunes := hoy - ((extract(isodow from hoy)::integer) - 1);
  desde := hoy - greatest(coalesce(p_dias, 14), 1) + 1;

  select jsonb_build_object(
    'hoy', hoy,
    'lunes', lunes,
    'hoy_personas', (select count(*) from public.visitas v where v.dia = hoy),
    'hoy_entradas', (select coalesce(sum(v.hits), 0) from public.visitas v where v.dia = hoy),
    'semana_personas', (
      select count(distinct v.visitor_id)
      from public.visitas v
      where v.dia >= lunes and v.dia <= hoy
    ),
    'semana_entradas', (
      select coalesce(sum(v.hits), 0)
      from public.visitas v
      where v.dia >= lunes and v.dia <= hoy
    ),
    'dias', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'dia', d.dia,
          'personas', d.personas,
          'entradas', d.entradas
        )
        order by d.dia
      )
      from (
        select
          v.dia,
          count(*)::integer as personas,
          sum(v.hits)::integer as entradas
        from public.visitas v
        where v.dia >= desde and v.dia <= hoy
        group by v.dia
      ) d
    ), '[]'::jsonb)
  ) into out;

  return out;
end;
$$;

revoke all on function public.registrar_visita(text) from public;
revoke all on function public.resumen_visitas(integer) from public, anon;
grant execute on function public.registrar_visita(text) to anon, authenticated;
grant execute on function public.resumen_visitas(integer) to authenticated;

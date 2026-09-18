-- Maki Nori · políticas, storage e índices
-- Corre esto en SQL Editor de Supabase (después del ALTER TABLE).

alter table public.platillos
  add column if not exists nombre_jp   text,
  add column if not exists en_feed     boolean not null default false,
  add column if not exists destacado   boolean not null default false,
  add column if not exists wide        boolean not null default false,
  add column if not exists feed_orden  integer not null default 0;

alter table public.categorias
  add column if not exists nombre_jp   text,
  add column if not exists slug        text;

-- Si Parrilla Coreana (u otra) se insertó dos veces, deja una y mueve platillos.
do $$
declare
  keeper uuid;
  extra uuid;
  slug text;
begin
  for slug in
    select c.slug from public.categorias c
    where c.slug is not null and btrim(c.slug) <> ''
    group by c.slug
    having count(*) > 1
  loop
    select c.id into keeper
    from public.categorias c
    where c.slug = slug
    order by (select count(*) from public.platillos p where p.categoria_id = c.id) desc, c.id
    limit 1;

    for extra in
      select c.id from public.categorias c
      where c.slug = slug and c.id <> keeper
    loop
      update public.platillos p
      set categoria_id = keeper
      where p.categoria_id = extra
        and not exists (
          select 1 from public.platillos k
          where k.categoria_id = keeper and k.nombre = p.nombre
        );
      delete from public.platillos where categoria_id = extra;
      delete from public.categorias where id = extra;
    end loop;
  end loop;
end $$;

create unique index if not exists categorias_slug_key
  on public.categorias (slug);

create unique index if not exists platillos_nombre_cat
  on public.platillos (categoria_id, nombre);

alter table public.platillos enable row level security;
alter table public.categorias enable row level security;

drop policy if exists "Public read platillos" on public.platillos;
drop policy if exists "Public read categorias" on public.categorias;
drop policy if exists "Auth insert platillos" on public.platillos;
drop policy if exists "Auth update platillos" on public.platillos;
drop policy if exists "Auth delete platillos" on public.platillos;
drop policy if exists "Auth insert categorias" on public.categorias;
drop policy if exists "Auth update categorias" on public.categorias;
drop policy if exists "Auth delete categorias" on public.categorias;

create policy "Public read platillos"
  on public.platillos for select
  to anon, authenticated
  using (true);

create policy "Public read categorias"
  on public.categorias for select
  to anon, authenticated
  using (true);

create policy "Auth insert platillos"
  on public.platillos for insert
  to authenticated
  with check (true);

create policy "Auth update platillos"
  on public.platillos for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete platillos"
  on public.platillos for delete
  to authenticated
  using (true);

create policy "Auth insert categorias"
  on public.categorias for insert
  to authenticated
  with check (true);

create policy "Auth update categorias"
  on public.categorias for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth delete categorias"
  on public.categorias for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('platillos', 'platillos', true)
on conflict (id) do nothing;

drop policy if exists "Public read platillos images" on storage.objects;
drop policy if exists "Auth upload platillos images" on storage.objects;
drop policy if exists "Auth update platillos images" on storage.objects;
drop policy if exists "Auth delete platillos images" on storage.objects;

create policy "Public read platillos images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'platillos');

create policy "Auth upload platillos images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'platillos');

create policy "Auth update platillos images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'platillos')
  with check (bucket_id = 'platillos');

create policy "Auth delete platillos images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'platillos');

-- ── Clientes: perfiles y pedidos ────────────────────────────────
-- Corre esto en SQL Editor. Las cuentas que YA existen (cocina)
-- quedan como admin. Los que se registren después son clientes.

create table if not exists public.perfiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nombre        text not null default '',
  tel           text not null default '',
  direccion     text not null default '',
  rol           text not null default 'cliente' check (rol in ('cliente', 'admin')),
  destacado     boolean not null default false,
  descuento     numeric not null default 0,
  last_seen_at  timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.pedidos (
  id          uuid primary key default gen_random_uuid(),
  perfil_id   uuid references public.perfiles(id) on delete set null,
  folio       text,
  items       jsonb not null default '[]'::jsonb,
  total       numeric not null default 0,
  descuento   numeric not null default 0,
  modo        text,
  mesa        text,
  direccion   text,
  nombre      text,
  tel         text,
  created_at  timestamptz not null default now()
);

create index if not exists pedidos_perfil_idx on public.pedidos (perfil_id, created_at desc);
create index if not exists perfiles_destacado_idx on public.perfiles (destacado, last_seen_at desc);

alter table public.perfiles enable row level security;
alter table public.pedidos enable row level security;

create or replace function public.es_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.rol = 'admin' from public.perfiles p where p.id = auth.uid()),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, tel, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'tel', ''),
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.perfiles_guard()
returns trigger
language plpgsql
as $$
begin
  if public.es_staff() then
    return new;
  end if;
  new.id := old.id;
  new.rol := old.rol;
  new.destacado := old.destacado;
  new.descuento := old.descuento;
  return new;
end;
$$;

drop trigger if exists perfiles_guard on public.perfiles;
create trigger perfiles_guard
  before update on public.perfiles
  for each row execute procedure public.perfiles_guard();

-- Primera vez: si todavía no hay clientes, las cuentas actuales son cocina.
insert into public.perfiles (id, nombre, rol)
select u.id, coalesce(split_part(u.email, '@', 1), ''), 'admin'
from auth.users u
where not exists (select 1 from public.perfiles p where p.id = u.id)
  and not exists (select 1 from public.perfiles p where p.rol = 'cliente');

create or replace function public.asegurar_staff()
returns public.perfiles
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.perfiles;
  admins int;
  label text;
begin
  if auth.uid() is null then
    raise exception 'no session';
  end if;

  select * into p from public.perfiles where id = auth.uid();
  if found then
    return p;
  end if;

  select coalesce(split_part(email, '@', 1), '') into label
  from auth.users where id = auth.uid();

  select count(*) into admins from public.perfiles where rol = 'admin';
  insert into public.perfiles (id, nombre, rol)
  values (auth.uid(), coalesce(label, ''), case when admins = 0 then 'admin' else 'cliente' end)
  returning * into p;
  return p;
end;
$$;

grant execute on function public.es_staff() to anon, authenticated;
grant execute on function public.asegurar_staff() to authenticated;

drop policy if exists "Read own or staff perfiles" on public.perfiles;
drop policy if exists "Insert own perfil" on public.perfiles;
drop policy if exists "Update own or staff perfiles" on public.perfiles;

create policy "Read own or staff perfiles"
  on public.perfiles for select
  to authenticated
  using (id = auth.uid() or public.es_staff());

create policy "Insert own perfil"
  on public.perfiles for insert
  to authenticated
  with check (id = auth.uid() and rol = 'cliente');

create policy "Update own or staff perfiles"
  on public.perfiles for update
  to authenticated
  using (id = auth.uid() or public.es_staff())
  with check (id = auth.uid() or public.es_staff());

drop policy if exists "Read own or staff pedidos" on public.pedidos;
drop policy if exists "Insert own pedidos" on public.pedidos;

create policy "Read own or staff pedidos"
  on public.pedidos for select
  to authenticated
  using (perfil_id = auth.uid() or public.es_staff());

create policy "Insert own pedidos"
  on public.pedidos for insert
  to authenticated
  with check (perfil_id = auth.uid());

grant select, insert, update on public.perfiles to authenticated;
grant select, insert on public.pedidos to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ── Cliente fiel: platillo de cortesía (en vez de solo un %) ──
-- Corre esto si la tabla perfiles ya existía.
alter table public.perfiles
  add column if not exists regalo_id uuid references public.platillos(id) on delete set null;

create or replace function public.perfiles_guard()
returns trigger
language plpgsql
as $$
begin
  if public.es_staff() then
    return new;
  end if;
  new.id := old.id;
  new.rol := old.rol;
  new.destacado := old.destacado;
  new.descuento := old.descuento;
  new.regalo_id := old.regalo_id;
  return new;
end;
$$;

-- ── Visitas de la página (hoy / semana en el CRM) ───────────────
-- Corre esto si el CRM ya existía. Día = America/Mexico_City.

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

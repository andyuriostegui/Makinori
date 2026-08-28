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

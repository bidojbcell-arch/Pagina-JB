-- =========================================================
-- JB Catálogo - Configuración de base de datos en Supabase
-- Copia y pega TODO este archivo en: Supabase > SQL Editor > New query > Run
-- =========================================================

-- 1) Tabla de productos
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric,
  categoria text not null default 'Otros',
  imagenes text[] not null default '{}',
  disponible boolean not null default true,
  destacado boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) Activar seguridad a nivel de fila (RLS)
alter table public.productos enable row level security;

-- 3) Cualquier persona (incluyendo visitantes sin sesión) puede VER
--    solo los productos marcados como disponibles.
drop policy if exists "Lectura publica de productos disponibles" on public.productos;
create policy "Lectura publica de productos disponibles"
  on public.productos
  for select
  to anon, authenticated
  using (disponible = true);

-- 4) Solo un usuario autenticado (el administrador) puede ver TODOS
--    los productos, incluidos los ocultos, para gestionarlos en el panel.
drop policy if exists "Lectura total para administrador" on public.productos;
create policy "Lectura total para administrador"
  on public.productos
  for select
  to authenticated
  using (true);

-- 5) Solo usuarios autenticados pueden crear, editar o eliminar productos.
drop policy if exists "Insertar productos - admin" on public.productos;
create policy "Insertar productos - admin"
  on public.productos
  for insert
  to authenticated
  with check (true);

drop policy if exists "Actualizar productos - admin" on public.productos;
create policy "Actualizar productos - admin"
  on public.productos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Eliminar productos - admin" on public.productos;
create policy "Eliminar productos - admin"
  on public.productos
  for delete
  to authenticated
  using (true);

-- =========================================================
-- 6) Bucket de almacenamiento para las fotos de productos
--    (Puedes crearlo también manualmente desde Storage > New bucket,
--     nómbralo exactamente: productos-imagenes, y márcalo como público)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('productos-imagenes', 'productos-imagenes', true)
on conflict (id) do nothing;

-- 7) Políticas de Storage: lectura pública, escritura solo autenticado.
drop policy if exists "Lectura publica de imagenes" on storage.objects;
create policy "Lectura publica de imagenes"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'productos-imagenes');

drop policy if exists "Subir imagenes - admin" on storage.objects;
create policy "Subir imagenes - admin"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'productos-imagenes');

drop policy if exists "Actualizar imagenes - admin" on storage.objects;
create policy "Actualizar imagenes - admin"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'productos-imagenes');

drop policy if exists "Eliminar imagenes - admin" on storage.objects;
create policy "Eliminar imagenes - admin"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'productos-imagenes');

-- =========================================================
-- Listo. Ahora crea tu usuario administrador en:
-- Supabase > Authentication > Users > Add user (email + contraseña)
-- Ese correo y contraseña serán los que uses para entrar a /admin/login
-- =========================================================

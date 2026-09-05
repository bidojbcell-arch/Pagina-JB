-- Configuración de imágenes de productos para JBCELL.
-- Ejecuta este archivo una sola vez en Supabase: SQL Editor > New query > Run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos-imagenes',
  'productos-imagenes',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- storage.objects.owner_id es texto, por eso auth.uid() se convierte explícitamente a texto.
-- Las fotos se sirven públicamente para que el catálogo pueda mostrarlas.
drop policy if exists "Usuarios autenticados suben fotos de productos" on storage.objects;
create policy "Usuarios autenticados suben fotos de productos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid()::text)
);

drop policy if exists "Usuarios actualizan sus fotos de productos" on storage.objects;
create policy "Usuarios actualizan sus fotos de productos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid()::text)
);

drop policy if exists "Usuarios eliminan sus fotos de productos" on storage.objects;
create policy "Usuarios eliminan sus fotos de productos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid()::text)
);

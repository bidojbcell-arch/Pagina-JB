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

-- El panel requiere sesión para cargar fotos. Las imágenes se sirven públicamente
-- porque el catálogo público necesita mostrarlas.
drop policy if exists "Usuarios autenticados suben fotos de productos" on storage.objects;
create policy "Usuarios autenticados suben fotos de productos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid())
);

-- Permite sustituir una foto solo a quien la subió.
drop policy if exists "Usuarios actualizan sus fotos de productos" on storage.objects;
create policy "Usuarios actualizan sus fotos de productos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid())
)
with check (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid())
);

drop policy if exists "Usuarios eliminan sus fotos de productos" on storage.objects;
create policy "Usuarios eliminan sus fotos de productos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'productos-imagenes'
  and owner_id = (select auth.uid())
);

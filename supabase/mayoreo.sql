-- Catálogo al por mayor para JBCELL.
-- Ejecuta este archivo una vez en Supabase > SQL Editor.
alter table public.productos add column if not exists visible_mayoreo boolean not null default false;
alter table public.productos add column if not exists precio_mayoreo numeric;
alter table public.productos add column if not exists minimo_mayoreo integer not null default 1 check (minimo_mayoreo >= 1);

create index if not exists productos_catalogo_mayoreo_idx
  on public.productos (visible_mayoreo, disponible, orden)
  where visible_mayoreo = true and disponible = true;


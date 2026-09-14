-- Guarda una posición manual para cada producto del catálogo.
alter table public.productos add column if not exists orden integer;

with posiciones as (
  select id, row_number() over (order by destacado desc, created_at desc)::integer as posicion
  from public.productos
)
update public.productos as producto
set orden = posiciones.posicion
from posiciones
where producto.id = posiciones.id and producto.orden is null;

alter table public.productos alter column orden set default 0;
update public.productos set orden = 0 where orden is null;
alter table public.productos alter column orden set not null;

create index if not exists productos_orden_created_at_idx
  on public.productos (orden asc, created_at desc);


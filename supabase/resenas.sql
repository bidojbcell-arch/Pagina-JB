create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (
    nombre = btrim(nombre)
    and char_length(btrim(nombre)) between 2 and 80
  ),
  calificacion smallint not null check (calificacion between 1 and 5),
  comentario text not null check (
    comentario = btrim(comentario)
    and char_length(btrim(comentario)) between 5 and 500
  ),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobada')),
  created_at timestamptz not null default now()
);

alter table public.resenas enable row level security;

grant select, insert on public.resenas to anon;
grant select, update, delete on public.resenas to authenticated;

create policy "Visitors can read approved reviews"
  on public.resenas for select
  to anon
  using (estado = 'aprobada');

create policy "Visitors can submit pending reviews"
  on public.resenas for insert
  to anon
  with check (estado = 'pendiente');

create policy "Authenticated users can read all reviews"
  on public.resenas for select
  to authenticated
  using (true);

create policy "Authenticated users can update reviews"
  on public.resenas for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete reviews"
  on public.resenas for delete
  to authenticated
  using (true);

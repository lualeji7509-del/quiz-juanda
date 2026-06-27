-- ============================================================
--  QUIZ DE EVENTO — Montaje de Supabase para un cliente nuevo
--  Pegar en: Supabase → SQL Editor → Run
--  (Crear ANTES un proyecto Supabase nuevo y vacío por cliente)
-- ============================================================

-- TÍTULO: setup (tabla submissions + bucket fotos + permisos)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score int not null,
  total int not null default 16,
  lang text default 'es',
  finished_at timestamptz not null,   -- hora exacta de terminar = orden de llegada (desempates)
  photo_url text,
  created_at timestamptz default now()
);

alter table public.submissions enable row level security;

-- Permisos para la clave pública (anon). Bajo riesgo: es una fiesta y el
-- reporte va protegido por PIN en el cliente. Para un producto de pago,
-- valorar restringir (Edge Function / clave por evento).
create policy "anon_insert" on public.submissions for insert to anon with check (true);
create policy "anon_select" on public.submissions for select to anon using (true);
create policy "anon_delete" on public.submissions for delete to anon using (true);  -- botón "Reiniciar ranking"

-- Almacén público de fotos
insert into storage.buckets (id, name, public)
values ('fotos','fotos', true)
on conflict (id) do nothing;

create policy "fotos_insert" on storage.objects for insert to anon with check (bucket_id = 'fotos');
create policy "fotos_select" on storage.objects for select to anon using (bucket_id = 'fotos');

-- Después: copiar Project URL + Publishable key (Settings → API Keys)
-- y pegarlas en CFG.SUPABASE_URL / CFG.SUPABASE_ANON dentro de index.html y reporte.html.
-- NUNCA usar la "secret key" en el cliente.

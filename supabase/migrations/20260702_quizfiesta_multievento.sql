-- TÍTULO: QuizFiesta multi-evento — tabla `eventos` + columna `evento` en submissions
-- Fecha: 2026-07-02
-- Qué hace: crea la base para vender a muchos clientes. Cada fiesta = 1 fila en `eventos`
-- (el juego la carga por ?evento=slug). `submissions` gana la columna `evento` para separar
-- el ranking por cliente. Aditivo: no rompe nada; las 22 filas de Juanda quedan como 'juanda'.

-- 1) Tabla de eventos (cada fiesta guardada aquí)
create table if not exists public.eventos (
  slug        text primary key,                       -- código único: boda-maria, jubilacion-papa…
  nombre      text not null,                           -- homenajeado o pareja
  tipo        text,                                    -- cumple / boda / … / lo que sea
  lang        text not null default 'es',              -- idioma del quiz (es/sv/en o cualquiera)
  preguntas   jsonb not null default '[]'::jsonb,      -- el array QUESTIONS del juego
  foto_url    text,                                    -- foto del homenajeado (opcional)
  intro       text,                                    -- texto de intro personalizado (opcional)
  pin         text,                                    -- pin para su ranking privado (opcional)
  activo      boolean not null default true,           -- desactivar sin borrar
  created_at  timestamptz not null default now()
);

-- 2) Columna `evento` en submissions (aditiva). Marca lo existente como 'juanda'.
alter table public.submissions add column if not exists evento text;
update public.submissions set evento = 'juanda' where evento is null;
create index if not exists submissions_evento_idx on public.submissions (evento);

-- 3) Seguridad (RLS) en eventos
alter table public.eventos enable row level security;

-- Lectura pública SOLO de eventos activos (el juego necesita cargarlos con la clave pública)
drop policy if exists eventos_public_read on public.eventos;
create policy eventos_public_read on public.eventos
  for select using (activo = true);

-- Inserción desde el creador (mismo nivel de confianza que submissions hoy).
-- TODO hardening: mover la publicación a una Edge Function con service_role y quitar este insert público.
drop policy if exists eventos_public_insert on public.eventos;
create policy eventos_public_insert on public.eventos
  for insert with check (true);

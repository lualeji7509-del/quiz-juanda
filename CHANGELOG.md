# CHANGELOG — QuizFiesta (motor del juego)

## v1.3 — 2026-07-02 · Producto multi-evento (base de datos)
- **Base de datos** (`supabase/migrations/20260702_quizfiesta_multievento.sql`): tabla `eventos` (cada fiesta: slug, nombre, tipo, idioma, preguntas, foto, pin) + columna `evento` en `submissions` (Juanda marcado como `juanda`). RLS: lectura pública de eventos activos + insert desde el creador.
- **`jugar.html`** (nuevo): un solo juego que carga cualquier fiesta por `?evento=slug` desde la DB (preguntas, nombre, foto, idioma). Personaliza textos con el nombre del homenajeado, remapea idiomas nuevos, estado separado por fiesta. Incluye Pista humana. NO toca el juego de Juanda (index.html sigue intacto).
- **`crear.html`**: botón **🚀 Publicar evento** → guarda en `eventos` y devuelve enlace del juego + enlace del ranking + QR. Fin del montaje manual.
- **`reporte.html`**: `?evento=slug` → cada cliente ve solo su ranking; el reset borra solo ese evento.
- Probado de punta a punta (crear→publicar→jugar→ranking). Datos de prueba limpiados.

## v1.2 — 2026-07-02 · Sin límites de evento e idioma + trampas nativas
- **Creador (`crear.html`)**: nuevo **"✨ Otro" en tipo de evento** (banco universal de 33 preguntas para cualquier ocasión: jubilación, comunión, aniversario…) y **"✨ Otro idioma"** (escribes el idioma: polaco, francés, alemán…).
- **Trampas IA multi-idioma**: la Edge Function `trampas` acepta cualquier idioma (`langName`) y el prompt exige **humor NATIVO de esa cultura** (referencias reales: famosos, platos, marcas), **no traducción literal**. Probado en polaco, francés y sueco.
- Modelo `gemini-flash-lite-latest` (barato, plan gratis). **Sin grounding/internet** por decisión de coste: el conocimiento cultural ya vive en el modelo.

## v1.1 — 2026-07-02 · Pista humana (comodín)
- **Pista humana**: botón "🧩 Pista humana" en la barra del juego, **1 solo uso**, gratis.
  Abre una tarjeta con **3 preguntas al azar para hacerle EN PERSONA al homenajeado**
  (rompe el hielo y anima la fiesta). Tras usarlo queda "🧩 Pista usada" (gris, desactivado).
- **Pozo general** de 8 preguntas (`HINTS_POOL`), sirve para cualquier evento → clonable a clientes.
- Trilingüe **es/sv/en**: botón, tarjeta y preguntas cambian de idioma en vivo, también con la tarjeta abierta.
- Solo toca `index.html`. No afecta a la puntuación, el envío de resultados ni Supabase.

## v1.0 — base
- Juego de Juanda (16 preguntas, trampas, foto-recuerdo, envío a Supabase, ranking, tour de ventas).

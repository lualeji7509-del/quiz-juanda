# ▶️ RETOMAR — QuizFiesta (estado 2026-07-01)

Punto único para continuar en otra sesión. Frase para arrancar:
**"seguimos con QuizFiesta — lee RETOMAR.md"**.

---

## 🔗 En vivo
- **Producto / demo de venta:** https://quizfiesta-w78f.onrender.com/demo.html (`?lang=sv` · `?lang=en`)
- **Motor de creación de quizzes:** https://quizfiesta-w78f.onrender.com/crear.html
- **Juego real de Juanda (privado):** https://quiz-juanda.onrender.com (la RAÍZ sirve el juego; el producto es SIEMPRE `/demo.html`)
- Repo GitHub: lualeji7509-del/quiz-juanda · carpeta local `~/quiz-juanda`
- 2 servicios Render del MISMO repo: `quiz-juanda` (juego real) y `quizfiesta` (producto).

## 🗂️ Mapa de archivos
| Archivo | Qué es |
|---|---|
| `demo.html` | Página de ventas premium (lo que se manda a leads) |
| `crear.html` | Motor: 5 bancos por evento → genera el quiz + trampas IA |
| `index.html` | El JUEGO (plantilla que se clona por cliente; foto con homenajeado obligatoria) |
| `formulario.html` | Cuestionario original (base del motor) |
| `reporte.html` | Ranking + reset, PIN 2026 |
| `supabase/functions/trampas/index.ts` | Edge Function (Gemini) para trampas — SIN DESPLEGAR |
| `VENTA_RAPIDA.md` | Precios + mensajes WhatsApp ES/SV/EN + plan |
| `leads-seguimiento.csv` | 16 leads SE/ES/UK |
| `OBJECIONES.md` · `EMAIL_KIT.md` | Banco de objeciones · kit de email + firma |
| `IDEAS_LANDING.md` | Ideas a copiar de myweddingtrivia (honestas) |
| `PRODUCTO.md` | Qué es + receta para clonar a un cliente |
| `qr-demo.png` · `tualiada-logo.png` | QR del demo · logo redondo tu aliada |

## ✅ Hecho
- Producto premium: paleta Confetti Pop (sin violeta), móvil animado above-the-fold, fotos modernas rotando, marcos por evento, confeti, **voz B multilingüe**, marca tu aliada (verde #27D17C, logo, "al·IA·da"), contacto WhatsApp +46707968175 + email tualiadacanal@gmail.com.
- **Prueba social HONESTA** (nada de "+500 eventos" falso): "estrenado en un evento real" + garantía + precio fundador.
- **crear.html**: bancos cumple/graduación/boda/despedida/baby → genera `QUESTIONS` + **trampas IA nivel (a)** por prompt (funciona ya).
- Kit de venta completo. Repo limpio.

## ✅ PENDIENTE #1 — Trampas IA "seamless" — HECHO (2026-07-02)
Edge Function `trampas` **desplegada** + secreto `GEMINI_KEY` **guardado** + **probado en vivo** (genera 2 trampas graciosas por pregunta). Sesión Supabase persistida (`supabase login --token`, token del portapapeles, nunca en chat). Token de acceso `claude-deploy` conviene revocarlo en la web (higiene, no urgente).
- Modelo Gemini: `gemini-flash-lite-latest` (plan GRATIS de la clave nueva; solo cuesta si se activa billing).
- Seguridad: la función solo acepta llamadas con Origin de quizfiesta/quiz-juanda/localhost.

## ✅ HECHO 2026-07-02 (v1.1 + v1.2)
- **Pista humana** (v1.1): comodín de 1 uso en `index.html` → 3 preguntas al azar (pozo general de 8, trilingüe es/sv/en). En vivo.
- **Sin límites de evento e idioma** (v1.2): `crear.html` con "Otro" evento (banco universal) y "Otro idioma" (escribes cualquiera). Trampas IA nativas por cultura (no traducción literal), probadas en PL/FR/SV. En vivo.

## 💰 REGLA DE COSTE (decidida, no re-litigar)
- **NO usar grounding/internet** en las funciones IA. El conocimiento cultural ya vive en el modelo (gratis). Misma filosofía que las BD semanales de JAO.
- Modelo `gemini-flash-lite-latest` (el barato). Generar trampas = 1 vez por evento, no por jugador. Clave server-side en Edge Function (nunca en cliente).
- ⚠️ El cargo de ~319 SEK fue de JAO (clave filtrada en su index.html), NO del quiz. Reclamación en `~/Jao proyectos App/docs/RECLAMACION_GOOGLE_2026-07-01.md`.

## ⏳ TAREAS PENDIENTES (grandes)
- **Producto multi-evento + separación por cliente** (LA obra para vender a escala): un solo juego que carga cada fiesta por `?evento=slug`, columna `evento_id` en `submissions` (hoy TODO cae en una tabla → clientes mezclados), y capa de traducción IA de banco + botones. Automatiza el montaje manual actual.
- **Poner LÍMITE DE GASTO** a la clave nueva de Gemini (belt-and-suspenders) — panel de Google, 1 min.
- **Botones del juego en idiomas nuevos**: hoy solo es/sv/en; traducir los ~30 textos por idioma que se venda (IA de una vez).
- **Revocar** el token de acceso `claude-deploy` en Supabase (higiene).
- **Testimonio real**: 1 frase del organizador de la graduación de Juanda → bajo el demo.
- **Editor de marcos por evento v2** (ahora hay marco base por tipo).
- **URL más limpia**: colgar producto de tualiada.es (Hostinger).
- **Ideas de `IDEAS_LANDING.md`**: varios mockups en abanico, etiquetas de módulos, "muro de fotos en vivo".

## ⚠️ Datos y reglas
- WhatsApp negocio: **+46707968175** · email: **tualiadacanal@gmail.com** · dominio marca: **tualiada.es**.
- Supabase del quiz: ref `kwikuwlnqpomevtiskta`, publishable key `sb_publishable_AFr8w1i0HUv1ArvbZDuTbg_jXdgkX1K` (pública, OK en cliente). Nunca la secret key en cliente.
- Token GitHub para push: reutilizar el PAT ya incrustado en los remotes de sus otros repos (usuario lualeji7509-del). Nunca en chat/memoria.

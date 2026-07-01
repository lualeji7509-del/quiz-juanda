# 🎓 Quiz de Evento — Producto (tu aliada)

Quiz interactivo y personalizado para **eventos** (graduaciones, cumpleaños, bodas,
despedidas). Los invitados juegan desde el móvil escaneando un QR y demuestran
cuánto conocen al homenajeado. Pensado para venderse llave en mano.

**Demo viva (caso Juanda):** https://quizfiesta-w78f.onrender.com

---

## ✨ Qué incluye
- **Portada** con foto del homenajeado + mensaje de bienvenida + botón "guardar la foto".
- **Quiz** de opción múltiple (respuestas reales del homenajeado + "trampas" graciosas).
- **Confirmar cada respuesta** (evita toques accidentales) y **anti-repetición** (un envío por móvil).
- **Foto recuerdo estilo fotógrafo**: la foto del invitado con el homenajeado, enmarcada con
  motivos del evento + fecha, lista para guardar en el carrete.
- **Aviso al anfitrión por WhatsApp** + **ranking en vivo** con orden de llegada (desempates).
- **Reporte privado con PIN** (ranking, fotos, reiniciar).
- **Bilingüe** (ahora ES/SV; ampliable) — el idioma se elige al abrir.
- **Cartel con QR** para imprimir o poner en pantalla en el evento.

## 🧩 Archivos
| Archivo | Qué es |
|---|---|
| `index.html` | El juego (página principal) |
| `reporte.html` | Ranking + reset, protegido con PIN |
| `formulario.html` | Cuestionario para que el homenajeado dé sus respuestas (opcional) |
| `juanda.jpg` | Foto del homenajeado (renombrar/ sustituir por cliente) |
| `tools/supabase_setup.sql` | Monta la base de datos de un cliente nuevo |
| `tools/generar_cartel.py` | Genera el cartel con QR |
| `carteles/` | Carteles generados por cliente (privado, **no se sube**) |

## 🛠️ Stack y coste
- **HTML estático** (Render o GitHub Pages) → hosting **gratis**.
- **Supabase** (free) guarda resultados + fotos → **gratis** hasta volúmenes altos.
- **Sin coste por jugador.** Margen prácticamente del 100%.

---

## 🔁 Cómo clonar para un CLIENTE NUEVO (receta)
1. **Copiar** la carpeta del proyecto a una nueva (p. ej. `quiz-<cliente>`).
2. **Preguntas y respuestas** → editar la lista `QUESTIONS` en `index.html`
   (texto ES/SV, respuesta correcta `ok`, trampas `no`).
3. **Foto** del homenajeado → reemplazar `juanda.jpg`.
4. **Textos** en `index.html` → objeto `CFG`:
   - `KEEPSAKE_TITLE / SUB / DATE` (texto de la foto recuerdo)
   - `WHATSAPP` (número del anfitrión, sin `+`)
   - `PIN` (acceso al reporte)
   - portada y mensajes (objetos `UI.es` / `UI.sv`).
5. **Supabase nuevo** por cliente: crear proyecto vacío → SQL Editor → pegar
   `tools/supabase_setup.sql`. Copiar **Project URL** + **Publishable key**
   (Settings → API Keys) a `CFG.SUPABASE_URL` / `CFG.SUPABASE_ANON` en
   `index.html` **y** `reporte.html`. (Nunca usar la *secret key* en el cliente.)
6. **Publicar** en Render/GitHub Pages → se obtiene la URL del juego.
7. **Cartel con QR**:
   `python3 tools/generar_cartel.py FOTO.png  https://URL-del-juego  carteles/cartel.png`
   (con `--cover Y` se tapa el texto inferior de un diseño y se integra el QR).

## ⚠️ Notas
- La clave **publishable** es pública por diseño (segura en el navegador). Las
  políticas `anon_*` permiten insertar/leer/borrar con esa clave: perfecto para
  una fiesta. Para un producto de pago con datos sensibles, valorar endurecer
  (Edge Function, clave por evento, sin `anon_delete`).
- Las fotos de menores u otros datos personales **no** deben subirse a un repo
  público (ver `.gitignore`).

## 💼 Ideas de venta
Encaja en la línea de negocio de **tu aliada** (webs/SaaS para autónomos y eventos)
y en "demos interactivas como servicio". Modelo: paquete llave en mano por evento
(montaje + personalización + cartel) con upsell de impresión y vídeo recuerdo.

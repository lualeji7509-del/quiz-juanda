// Edge Function — QuizFiesta · generar "trampas" (respuestas falsas graciosas) con Gemini.
// La clave vive SOLO en el servidor (secret GEMINI_KEY), nunca en el navegador ni en el repo.
//
// Entrada (POST JSON): { items:[{q, ok}], lang:"es|sv|en", tipo:"..." }
// Salida (JSON):       { traps:[[falsa1, falsa2], ...] }  (mismo orden que items)
//
// Secret necesario en Supabase:  GEMINI_KEY  → clave de la API de Gemini (aistudio.google.com)
// Desplegar (verify_jwt OFF; la seguridad la da el filtro por Origin):
//   supabase functions deploy trampas --no-verify-jwt
//   supabase secrets set GEMINI_KEY=xxxxx

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const KEY = Deno.env.get("GEMINI_KEY") ?? "";
const MODEL = "gemini-flash-lite-latest";
const URL_GEMINI =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const ORIGENES_OK = [
  "https://quizfiesta-w78f.onrender.com",
  "https://quiz-juanda.onrender.com",
];
function originPermitido(o: string): boolean {
  if (!o) return false;
  if (ORIGENES_OK.includes(o)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o)) return true;
  return false;
}
function cors(o: string) {
  return {
    "Access-Control-Allow-Origin": originPermitido(o) ? o : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey",
    "Vary": "Origin",
  };
}
function j(body: unknown, status: number, o: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(o), "Content-Type": "application/json" },
  });
}

const LANG: Record<string, string> = { es: "español", sv: "sueco", en: "inglés" };

interface Item { q: string; ok: string }

serve(async (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(o) });
  if (req.method !== "POST") return j({ error: "Method Not Allowed" }, 405, o);
  if (!originPermitido(o)) return j({ error: "Origen no permitido" }, 403, o);
  if (!KEY) return j({ error: "Falta GEMINI_KEY" }, 500, o);

  let body: { items?: Item[]; lang?: string; tipo?: string };
  try { body = await req.json(); } catch { return j({ error: "JSON inválido" }, 400, o); }

  const items = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const lang = LANG[body.lang ?? ""] ? (body.lang as string) : "es";
  const tipo = (body.tipo || "una fiesta").toString().slice(0, 40);
  if (!items.length) return j({ error: "sin items" }, 400, o);

  const lista = items.map((it, i) =>
    `${i + 1}) ${String(it.q).slice(0, 200)} (correcta: ${String(it.ok).slice(0, 120)})`
  ).join("\n");

  const prompt =
`Eres guionista de fiestas con mucho humor. Para un quiz de "${tipo}", te doy preguntas con su respuesta CORRECTA.
Para CADA pregunta inventa exactamente 2 respuestas FALSAS: graciosas, creíbles, CORTAS, en ${LANG[lang]}, con el mismo estilo que la correcta y SIN repetirla.
Devuelve SOLO un JSON: un array donde cada elemento es un array de 2 strings [falsa1, falsa2], en el MISMO orden. Nada más.

Preguntas:
${lista}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 1200, temperature: 0.9, responseMimeType: "application/json" },
  };

  try {
    const res = await fetch(`${URL_GEMINI}?key=${KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return j({ error: "gemini", detail: data?.error?.message || "" }, 200, o);
    const txt = data?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join("") || "[]";
    let traps: string[][] = [];
    try { traps = JSON.parse(txt); } catch { traps = []; }
    // normaliza: exactamente 2 por pregunta
    traps = items.map((_, i) => {
      const t = Array.isArray(traps[i]) ? traps[i].map(String).filter(Boolean).slice(0, 2) : [];
      while (t.length < 2) t.push("");
      return t;
    });
    return j({ traps }, 200, o);
  } catch (_e) {
    return j({ error: "conexión" }, 200, o);
  }
});

# EmprendeCL

Plataforma de emprendimiento asistida por IA, enfocada en el ecosistema chileno (CORFO, SERCOTEC, SpA, MercadoPago, etc.).

## Stack

- **Next.js 14** (App Router) — frontend + API routes
- **Supabase** — auth + Postgres + RLS
- **OpenRouter** — proveedor unificado de modelos IA (Claude, GPT-4, Gemini, DeepSeek, etc.)
- **Tailwind CSS** — estilos
- **Vitest** — tests unitarios

## Setup local

```bash
cp .env.example .env.local
# edita .env.local con tus claves
npm install
npm run dev
```

## Variables de entorno

Ver `.env.example`. Las requeridas son:

| Variable | Para qué |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key de Supabase |
| `OPENROUTER_API_KEY` | API key de OpenRouter ([crear aquí](https://openrouter.ai/keys)) |
| `AI_MODEL` *(opcional)* | Modelo a usar — ver opciones abajo |

## Cambiar de modelo IA

Para probar diferentes modelos, edita `AI_MODEL` en `.env.local` o Vercel:

```bash
# Mejor calidad
AI_MODEL=anthropic/claude-3.5-sonnet

# Alternativas fuertes
AI_MODEL=openai/gpt-4o
AI_MODEL=anthropic/claude-3.7-sonnet

# Económico para testing
AI_MODEL=deepseek/deepseek-chat
AI_MODEL=google/gemini-2.0-flash-exp:free
```

Ver el [catálogo completo de OpenRouter](https://openrouter.ai/models).

## Migraciones de DB

Las migraciones SQL están en `supabase/migrations/`. Ejecútalas en orden desde el SQL Editor de Supabase.

## Tests

```bash
npm test           # corre todos los tests
npx vitest         # watch mode
```

## Deploy

Configurado para Vercel. Solo agrega las variables de entorno y conecta el repo.

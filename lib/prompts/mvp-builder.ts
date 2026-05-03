import { CHILE_CONTEXT } from '@/lib/chile-context'

export function buildMvpBuilderPrompts(
  idea: string,
  previousOutputs: Record<string, Record<string, unknown>>
): { system: string; user: string } {
  const mvpRequirements = previousOutputs['mvp_requirements'] ?? {}
  const leanCanvas = previousOutputs['lean_canvas'] ?? {}

  const system = `Eres un full-stack developer experto en construir MVPs rápidos para el mercado chileno.
Recomiendas stacks modernos, económicos y con hosting disponible en Latinoamérica.
Creas código limpio, funcional y fácil de mantener por un equipo pequeño. Responde SIEMPRE en español.
${CHILE_CONTEXT}`

  const user = `Idea: ${idea}
Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}
Requisitos MVP: ${JSON.stringify(mvpRequirements, null, 2)}

Genera una guía técnica completa en JSON:
{
  "tech_recommendation": "stack tecnológico recomendado con justificación",
  "setup_steps": ["paso 1", "paso 2"],
  "database_schema": [
    { "table": "nombre_tabla", "fields": ["campo: tipo"] }
  ],
  "api_endpoints": [
    { "method": "GET", "path": "/ruta", "description": "qué hace" }
  ],
  "landing_page_html": "HTML completo con Tailwind CDN: hero, features, CTA y formulario de contacto",
  "deployment_guide": "instrucciones para subir a Vercel o Render gratis",
  "estimated_cost_clp": "costo mensual estimado en CLP para hosting"
}

El landing_page_html debe ser HTML funcional con DOCTYPE, head y body completos.
Devuelve SOLO el JSON.`

  return { system, user }
}
